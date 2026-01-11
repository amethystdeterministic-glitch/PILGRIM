#!/usr/bin/env bash
set -e

echo "[*] UI:"
curl -s -I http://127.0.0.1:8080 | head -n 1 || true
echo "[*] API:"
curl -s http://127.0.0.1:9090/zytes | jq length 2>/dev/null || curl -s http://127.0.0.1:9090/zytes
