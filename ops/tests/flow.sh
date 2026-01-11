#!/usr/bin/env bash
set -e

API="http://127.0.0.1:9090"

echo "[*] Flow: update zyte"
curl -s -X POST "$API/zyte/update" \
  -H "Content-Type: application/json" \
  -d '{"id":"smoke-test","content":"updated"}' >/dev/null

echo "[*] Flow: history"
curl -s "$API/history/smoke-test" >/dev/null

echo "[*] Flow: proof"
curl -s "$API/proof/smoke-test" >/dev/null

echo "[*] Flow: bundle"
curl -s "$API/bundle/smoke-test" >/dev/null

echo "[+] FLOW OK"
