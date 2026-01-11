#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PUB="$ROOT/public"

rm -rf "$PUB"
mkdir -p "$PUB"

cp -r "$ROOT/ui" "$PUB/ui"
cp -r "$ROOT/zyte/snapshot" "$PUB/snapshot"
cp "$ROOT/zyte/ENDPOINT_v12.txt" "$PUB/ENDPOINT.txt"
cp "$ROOT/zyte/FROZEN_FINAL.txt" "$PUB/FROZEN.txt"

echo "[+] Read-only mirror created at /public"
