#!/usr/bin/env bash
set -euo pipefail

ROOT="$(pwd)"
LEDGER="$ROOT/source/runtime/source-ledger.ndjson"

mkdir -p "$ROOT/source/runtime"

# Minimal permission clamp: readable, writable by owner only
# (append-only at OS level is not portable on Android/Termux)
touch "$LEDGER"
chmod 600 "$LEDGER" || true

echo "ENFORCED: $LEDGER"
echo "RULE: write entries only via: node source/runtime/proof-emit.js"
echo "RULE: verify at any time via: node source/runtime/source-verify.js"
