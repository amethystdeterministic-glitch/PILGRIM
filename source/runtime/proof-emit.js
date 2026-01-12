#!/usr/bin/env node
"use strict";

/**
 * Deterministic SOURCE proofchain emitter (v1)
 *
 * - Writes append-only entries to: source/runtime/source-ledger.ndjson
 * - Deterministically hashes a canonical string form.
 * - Never rewrites history. Always appends.
 *
 * Usage:
 *   echo "payload text" | node source/runtime/proof-emit.js
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const LEDGER = path.join(process.cwd(), "source", "runtime", "source-ledger.ndjson");
const SOURCE_CURRENT = path.join(process.cwd(), "source", "runtime", "current-source.json");

function sha256Hex(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function canonicalStringify(value) {
  if (value === null) return "null";
  const t = typeof value;
  if (t === "string") return JSON.stringify(value);
  if (t === "number") return Number.isFinite(value) ? String(value) : JSON.stringify(String(value));
  if (t === "boolean") return value ? "true" : "false";
  if (Array.isArray(value)) return "[" + value.map(canonicalStringify).join(",") + "]";
  if (t === "object") {
    const keys = Object.keys(value).sort();
    return "{" + keys.map(k => JSON.stringify(k) + ":" + canonicalStringify(value[k])).join(",") + "}";
  }
  return JSON.stringify(String(value));
}

function nowUtcIso() {
  return new Date().toISOString();
}

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function lastLedgerEntry() {
  if (!fs.existsSync(LEDGER)) return null;
  const data = fs.readFileSync(LEDGER, "utf8").trim();
  if (!data) return null;
  const lines = data.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    if (!line) continue;
    try { return JSON.parse(line); } catch { return null; }
  }
  return null;
}

function main() {
  const payload = readStdin();
  const payloadHash = sha256Hex(payload);

  const prev = lastLedgerEntry();
  const prevHash = prev && prev.entry_hash ? prev.entry_hash : "GENESIS";

  const entry = {
    schema: "amethyst.source.ledger.v1",
    utc: nowUtcIso(),
    source_id: "source-current",
    payload_hash: payloadHash,
    proof_path: "_",
    prev_hash: prevHash,
  };

  // entry_hash is computed over a canonical object that excludes itself
  const preimage = canonicalStringify(entry);
  entry.entry_hash = sha256Hex(preimage);

  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify(entry) + "\n");

  // Maintain/refresh Source current (bridge metadata)
  const current = {
    schema: "amethyst.source.current.v1",
    source_id: "source-current",
    created_at_utc: null,
    notes: "Canonical Source current state. ZYTE is legacy. SCRY must read Source-first and only bridge ZYTE if Source is missing.",
    head_entry_hash: entry.entry_hash,
    ledger_path: "source/runtime/source-ledger.ndjson",
  };
  fs.mkdirSync(path.dirname(SOURCE_CURRENT), { recursive: true });
  fs.writeFileSync(SOURCE_CURRENT, JSON.stringify(current, null, 2) + "\n");

  process.stdout.write(JSON.stringify(entry, null, 2) + "\n");
}

main();
