#!/usr/bin/env bash
set -e

echo "[+] Amethyst Zyte Builder — Installer"

# sanity
command -v node >/dev/null || { echo "Node.js required"; exit 1; }
command -v python3 >/dev/null || { echo "Python3 required"; exit 1; }

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "[+] Preparing directories"
mkdir -p "$ROOT/tmp"

echo "[+] Verifying frozen state"
[ -f "$ROOT/zyte/FROZEN_FINAL.txt" ] || { echo "Not frozen. Abort."; exit 1; }

echo "[+] Running integrity check"
"$ROOT/ops/maintenance/integrity.sh"

echo "[+] Starting services"
"$ROOT/ops/start.sh"

echo "[+] Install complete"
echo "UI  : http://127.0.0.1:8080"
echo "API : http://127.0.0.1:9090"
