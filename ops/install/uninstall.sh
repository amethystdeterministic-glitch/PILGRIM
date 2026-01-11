#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"

echo "[+] Stopping services"
"$ROOT/ops/stop.sh"

echo "[+] Removing runtime artifacts"
rm -rf /tmp/zyte.pid /tmp/ui.pid /tmp/zyte.log /tmp/ui.log || true

echo "[+] Uninstall complete (data preserved)"
