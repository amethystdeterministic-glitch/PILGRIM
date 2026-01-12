#!/usr/bin/env node
"use strict";

import http from "http";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const PORT = Number(process.env.SCRY_PORT || 9191);

// ROOT is the sandbox boundary for any file reads.
// Defaults to repo root (process.cwd()).
const ROOT = process.env.SCRY_ROOT
  ? path.resolve(process.env.SCRY_ROOT)
  : process.cwd();

function json(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(body),
  });
  res.end(body);
}

function text(res, status, body, contentType = "text/plain; charset=utf-8") {
  const out = typeof body === "string" ? body : String(body ?? "");
  res.writeHead(status, {
    "Content-Type": contentType,
    "Content-Length": Buffer.byteLength(out),
  });
  res.end(out);
}

function safeResolve(p) {
  const rp = path.resolve(p);
  // Enforce ROOT boundary (no path traversal).
  if (!rp.startsWith(ROOT)) return null;
  return rp;
}

function safeReadFile(absPath) {
  const rp = safeResolve(absPath);
  if (!rp) return null;
  if (!fs.existsSync(rp)) return null;
  return fs.readFileSync(rp, "utf8");
}

function safeReadRepoRelative(relPath) {
  // Allow callers to supply "source/runtime/..." safely.
  const abs = path.join(ROOT, relPath);
  return safeReadFile(abs);
}

function runVerify() {
  // Deterministic: run verifier as a subprocess, return stdout.
  // If it throws, bubble caller will format.
  const out = execSync("node source/runtime/source-verify.js", {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return out;
}

function deriveHeadFromVerify(verifyStdout) {
  // verifyStdout should be JSON like:
  // { ok: true, schema: "...", entries: n, head: "..." }
  // /source/head should return { head, entries }
  let parsed;
  try {
    parsed = JSON.parse(verifyStdout);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object") return null;
  return {
    head: parsed.head ?? null,
    entries: parsed.entries ?? null,
  };
}

function nowIso() {
  return new Date().toISOString();
}

function scryStatus() {
  // Read-only status surface. Does NOT mutate anything.
  // We do not re-run verification here to avoid unnecessary compute.
  // (Verification is exposed via /source/verify and /source/head.)
  return {
    ok: true,
    service: "scry",
    mode: "read-only",
    port: PORT,
    root: ROOT,
    time: nowIso(),
  };
}

const server = http.createServer((req, res) => {
  try {
    // Only allow GET (read-only).
    if (req.method !== "GET") {
      res.writeHead(405);
      return res.end();
    }

    const url = new URL(req.url, `http://localhost:${PORT}`);

    // --- HEALTH ---
    if (url.pathname === "/health") {
      return text(res, 200, "OK");
    }

    // --- SCRY STATUS ---
    if (url.pathname === "/scry/status") {
      return json(res, 200, scryStatus());
    }

    // --- SOURCE: CURRENT ---
    // Canonical current source state file.
    // If your repo uses a different filename, adjust the one line below.
    if (url.pathname === "/source/current") {
      const data =
        safeReadRepoRelative("source/runtime/source-current.json") ??
        safeReadRepoRelative("source/runtime/source-current.ndjson") ??
        null;

      if (!data) return text(res, 404, "NOT FOUND");
      // Return as-is. If it's JSON, caller will parse; we keep deterministic bytes.
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(data);
    }

    // --- SOURCE: LEDGER ---
    // NDJSON, append-only ledger.
    if (url.pathname === "/source/ledger") {
      const data = safeReadRepoRelative("source/runtime/source-ledger.ndjson");
      if (!data) return text(res, 404, "NOT FOUND");
      res.writeHead(200, { "Content-Type": "application/x-ndjson" });
      return res.end(data);
    }

    // --- SOURCE: VERIFY ---
    if (url.pathname === "/source/verify") {
      try {
        const out = runVerify();
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(out);
      } catch (e) {
        const msg = e?.stderr?.toString?.() || e?.message || "VERIFY FAILED";
        return json(res, 400, {
          ok: false,
          schema: "amethyst.source.verify.error.v1",
          error: msg,
        });
      }
    }

    // --- SOURCE: HEAD ---
    // Calls verifier read-only and surfaces { head, entries }.
    if (url.pathname === "/source/head") {
      try {
        const out = runVerify();
        const headObj = deriveHeadFromVerify(out);
        if (!headObj) {
          return json(res, 400, {
            ok: false,
            schema: "amethyst.source.head.error.v1",
            error: "Unable to parse verifier output as JSON",
          });
        }
        return json(res, 200, {
          ok: true,
          schema: "amethyst.source.head.v1",
          head: headObj.head,
          entries: headObj.entries,
        });
      } catch (e) {
        const msg = e?.stderr?.toString?.() || e?.message || "HEAD FAILED";
        return json(res, 400, {
          ok: false,
          schema: "amethyst.source.head.error.v1",
          error: msg,
        });
      }
    }

    // --- READ (SANDBOXED) ---
    // /read?p=<repo-relative-or-absolute-path>
    // Read-only helper. Enforces ROOT boundary.
    if (url.pathname === "/read") {
      const p = url.searchParams.get("p");
      if (!p) return text(res, 400, "MISSING p");

      // If p is absolute, attempt safeReadFile. If relative, resolve from ROOT.
      const abs = path.isAbsolute(p) ? p : path.join(ROOT, p);
      const data = safeReadFile(abs);
      if (!data) return text(res, 404, "NOT FOUND");
      return text(res, 200, data, "text/plain; charset=utf-8");
    }

    // --- UNKNOWN ---
    res.writeHead(404);
    return res.end("UNKNOWN");
  } catch (err) {
    return json(res, 500, {
      ok: false,
      schema: "amethyst.scry.error.v1",
      error: err?.message || "INTERNAL ERROR",
    });
  }
});

server.listen(PORT, () => {
  console.log(`SCRY listening on ${PORT}`);
});
