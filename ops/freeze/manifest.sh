#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/ops/freeze/manifest.sha256"

cd "$ROOT"
find zyte ui ops -type f -print0 \
  | sort -z \
  | xargs -0 sha256sum > "$OUT"

echo "[+] Manifest written to ops/freeze/manifest.sha256"
