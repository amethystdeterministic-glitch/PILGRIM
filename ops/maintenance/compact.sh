#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
STORE="$ROOT/zyte/storage/zytes.json"
TMP="$ROOT/zyte/storage/zytes.compact.json"

node - << 'NODE'
const fs = require("fs");
const path = require("path");

const STORE = process.argv[1];
const TMP = process.argv[2];

const data = JSON.parse(fs.readFileSync(STORE, "utf8"));
const seen = {};
const compacted = [];

for (const z of data) {
  if (!seen[z.id] || seen[z.id].version < z.version) {
    seen[z.id] = z;
  }
}

for (const k of Object.keys(seen)) compacted.push(seen[k]);

fs.writeFileSync(TMP, JSON.stringify(compacted, null, 2));
NODE
"$STORE" "$TMP"

mv "$TMP" "$STORE"
echo "[+] Compaction complete"
