#!/usr/bin/env bash
set -e

rm -f /tmp/zyte.pid /tmp/ui.pid || true
rm -f /tmp/zyte.log /tmp/ui.log || true

echo "[+] Runtime state reset"
