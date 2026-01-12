#!/usr/bin/env node
"use strict";

/**
 * SCRY Runtime Server (v1)
 * Read-only. Deterministic filesystem read with root containment.
 *
 * Endpoints:
 *  GET /health              -> OK
 *  GET /source/current      -> Source current (bridges legacy ZYTE if missing)
 *  GET /source/head         -> Last ledger entry (Source-first, legacy fallback)
 *  GET /source/ledger       -> Full ledger NDJSON (Source-first, legacy fallback)
 *  GET /source/verify       -> Runs Source verifier (Source-first, legacy fallback)
 *
 * Legacy:
 *  - If Source files missing, falls back to zyte/runtime/current-zyte.json and zyte/runtime/ledger.ndjson
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const PORT = Number(process.env.SCRY_PORT || 9191);
const ROOT = process.env.SCRY_ROOT ? path.resolve(process.env.SCRY_ROOT) : process.cwd();

const SOURCE_CURRENT = path.join(ROOT, "source", "runtime", "current-source.json");
const SOURCE_LEDGER  = path.join(ROOT, "source", "runtime", "source-ledger.ndjson");
const SOURCE_VERIFY  = path.join(ROOT, "source", "runtime", "source-verify.js");

const ZYTE_CURRENT = path.join(ROOT, "zyte", "runtime", "current-zyte.json");
const ZYTE_LEDGER  = path.join(ROOT, "zyte", "runtime", "ledger.ndjson");

function safePath(p) {
  const rp = path.resolve(p);
  if (!rp.startsWith(ROOT)) return null;
  return rp;
}

function exists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

function readFileText(p) {
  const rp = safePath(p);
  if (!rp) return null;
  if (!exists(rp)) return null;
  try { return fs.readFileSync(rp, "utf8"); } catch { return null; }
}

function readLastNdjsonObject(p) {
  const t = readFileText(p);
  if (!t) return null;
  const lines = t.trim().split("\n").filter(Boolean);
  for (let i = lines.length - 1; i >= 0; i--) {
    try { return JSON.parse(lines[i]); } catch {}
  }
  return null;
}

function json(res, status, obj) {
  res.writeHead(status, { "Content-Type": "application/json" });
  return res.end(JSON.stringify(obj, null, 2) + "\n");
}

function text(res, status, body) {
  res.writeHead(status, { "Content-Type": "text/plain" });
  return res.end(body);
}

function sourceOrBridgeCurrent() {
  // Source-first
  const s = readFileText(SOURCE_CURRENT);
  if (s) return { status: 200, body: s, kind: "source" };

  // Bridge from ZYTE if present
  const z = readFileText(ZYTE_CURRENT);
  if (z) {
    let legacy;
    try { legacy = JSON.parse(z); } catch { legacy = null; }
    const bridged = {
      schema: "amethyst.source.current.v1",
      source_id: (legacy && (legacy.source_id || legacy.zyte_id)) ? (legacy.source_id || legacy.zyte_id) : "source-current",
      created_at_utc: null,
      notes: "Bridged artifact. Source current missing, bridged from legacy ZYTE current. Create source/runtime/current-source.json to remove legacy dependence.",
      bridge_from: "zyte/runtime/current-zyte.json"
    };
    return { status: 200, body: JSON.stringify(bridged, null, 2) + "\n", kind: "bridge" };
  }

  return { status: 404, body: JSON.stringify({ error: "NO_SOURCE_CURRENT" }, null, 2) + "\n", kind: "none" };
}

function sourceOrLegacyLedgerPath() {
  if (exists(SOURCE_LEDGER)) return { kind: "source", path: SOURCE_LEDGER };
  if (exists(ZYTE_LEDGER)) return { kind: "legacy", path: ZYTE_LEDGER };
  return { kind: "none", path: null };
}

function runVerify(res) {
  // Source-first verify script
  if (exists(SOURCE_VERIFY)) {
    const out = spawnSync("node", [SOURCE_VERIFY], { cwd: ROOT, encoding: "utf8" });
    if (out.status === 0) return json(res, 200, JSON.parse(out.stdout));
    return json(res, 400, { ok: false, error: "VERIFY_FAILED", stderr: out.stderr || out.stdout });
  }

  // No verifier => cannot claim verification
  return json(res, 404, { ok: false, error: "NO_VERIFIER" });
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET") return text(res, 405, "");

  if (req.url === "/health") return text(res, 200, "OK");

  if (req.url === "/source/current") {
    const r = sourceOrBridgeCurrent();
    res.writeHead(r.status, { "Content-Type": "application/json" });
    return res.end(r.body);
  }

  if (req.url === "/source/ledger") {
    const pick = sourceOrLegacyLedgerPath();
    if (!pick.path) return json(res, 404, { error: "NO_LEDGER" });

    const data = readFileText(pick.path);
    if (!data) return json(res, 404, { error: "NO_LEDGER" });

    res.writeHead(200, {
      "Content-Type": "application/x-ndjson",
      "X-Amethyst-Ledger": pick.kind
    });
    return res.end(data);
  }

  if (req.url === "/source/head") {
    const pick = sourceOrLegacyLedgerPath();
    if (!pick.path) return json(res, 404, { error: "NO_LEDGER" });

    const head = readLastNdjsonObject(pick.path);
    if (!head) return json(res, 404, { error: "NO_HEAD" });

    return json(res, 200, { schema: "amethyst.source.head.v1", ledger: pick.kind, head });
  }

  if (req.url === "/source/verify") {
    return runVerify(res);
  }

  return text(res, 404, "UNKNOWN");
});

server.listen(PORT, () => {
  console.log(`SCRY listening on ${PORT} (root=${ROOT})`);
});
