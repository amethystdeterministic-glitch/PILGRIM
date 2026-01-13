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

function readStdin() {
  try {
    return fs.readFileSync(0, "utf8");
  } catch {
    return "";
  }
}

function lastHeadHash() {
  if (!fs.existsSync(LEDGER)) return null;
  const raw = fs.readFileSync(LEDGER, "utf8").trim();
  if (!raw) return null;
  const lines = raw.split("\n").filter(Boolean);
  const last = JSON.parse(lines[lines.length - 1]);
  return last.entry_hash || null;
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function main() {
  ensureDir(path.dirname(LEDGER));

  const payload = (readStdin() || "").trim();
  const payload_hash = sha256Hex(payload);

  const prev_hash = lastHeadHash() || "GENESIS";

  const base = {
    schema: "amethyst.source.ledger.v1",
    utc: new Date().toISOString(),
    source_id: "source-current",
    payload_hash,
    proof_path: "_",
    prev_hash
  };

  const preimage = stableStringify(base);
  const entry_hash = sha256Hex(preimage);

  const entry = { ...base, entry_hash };

  fs.appendFileSync(LEDGER, JSON.stringify(entry) + "\n", "utf8");
  process.stdout.write(JSON.stringify(entry, null, 2) + "\n");
}

main();
