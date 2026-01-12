#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LEDGER = path.join(process.cwd(), "source", "runtime", "source-ledger.ndjson");

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("hex");
}

function stableStringify(value) {
  if (value === null) return "null";
  const t = typeof value;
  if (t === "string") return JSON.stringify(value);
  if (t === "number") return Number.isFinite(value) ? String(value) : JSON.stringify(String(value));
  if (t === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  if (t === "object") {
    const keys = Object.keys(value).sort();
    return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
  }
  return JSON.stringify(String(value));
}

function fail(error, meta) {
  const out = { ok: false, schema: "amethyst.source.verify.v1", error, ...meta };
  process.stdout.write(JSON.stringify(out, null, 2) + "\n");
  process.exit(1);
}

function main() {
  if (!fs.existsSync(LEDGER)) fail("NO_LEDGER", { ledger_path: "source/runtime/source-ledger.ndjson" });

  const raw = fs.readFileSync(LEDGER, "utf8");
  const lines = raw.split("\n").filter(Boolean);
  if (!lines.length) fail("EMPTY_LEDGER", {});

  let expectedPrev = "GENESIS";
  let head = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      fail("BAD_JSON", { line: i + 1 });
    }

    const req = ["schema", "utc", "source_id", "payload_hash", "proof_path", "prev_hash", "entry_hash"];
    for (const k of req) {
      if (!(k in entry)) fail("MISSING_FIELD", { line: i + 1, field: k });
    }

    if (entry.prev_hash !== expectedPrev) {
      fail("BROKEN_CHAIN", { line: i + 1, expected: expectedPrev, got: entry.prev_hash });
    }

    const base = {
      schema: entry.schema,
      utc: entry.utc,
      source_id: entry.source_id,
      payload_hash: entry.payload_hash,
      proof_path: entry.proof_path,
      prev_hash: entry.prev_hash
    };

    const preimage = stableStringify(base);
    const computed = sha256Hex(preimage);

    if (computed !== entry.entry_hash) {
      fail("BAD_ENTRY_HASH", { line: i + 1, computed, got: entry.entry_hash });
    }

    expectedPrev = entry.entry_hash;
    head = entry.entry_hash;
  }

  process.stdout.write(JSON.stringify({
    ok: true,
    schema: "amethyst.source.verify.v1",
    entries: lines.length,
    head
  }, null, 2) + "\n");
}

main();
