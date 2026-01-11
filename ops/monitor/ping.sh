#!/usr/bin/env bash
set -e

curl -s http://127.0.0.1:9090/zytes >/dev/null && echo "[+] API OK" || echo "[-] API FAIL"
curl -s -I http://127.0.0.1:8080 | head -n 1 && echo "[+] UI OK" || echo "[-] UI FAIL"
