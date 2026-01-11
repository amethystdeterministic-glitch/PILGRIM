#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

node - << 'NODE'
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const STORE = path.join(process.argv[1], "zyte/storage/zytes.json");

function hash(z) {
  const p = `${z.id}|${z.title}|${z.content}|${z.version}|${z.created_at}`;
  return crypto.createHash("sha256").update(p).digest("hex");
}

const data = JSON.parse(fs.readFileSync(STORE, "utf8"));
let ok = true;

for (const z of data) {
  if (z.hash !== hash(z)) {
    console.error("HASH MISMATCH:", z.id);
    ok = false;
  }
}

if (ok) console.log("INTEGRITY OK");
NODE
"$ROOT"

echo "[+] Integrity check finished"
