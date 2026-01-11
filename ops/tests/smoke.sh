#!/usr/bin/env bash
set -e

API="http://127.0.0.1:9090"

echo "[*] Smoke: list zytes"
curl -s "$API/zytes" >/dev/null

echo "[*] Smoke: create test zyte"
curl -s -X POST "$API/zyte" \
  -H "Content-Type: application/json" \
  -d '{"id":"smoke-test","title":"Smoke Test","content":"ok"}' >/dev/null || true

echo "[*] Smoke: get zyte"
curl -s "$API/zyte/smoke-test" >/dev/null

echo "[*] Smoke: render"
curl -s "$API/render/smoke-test" >/dev/null

echo "[+] SMOKE OK"
