#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "[+] Starting Zyte API (foreground)"

node zyte/runtime/zyte-server.js &
ZYTE_PID=$!

sleep 1

if ! kill -0 "$ZYTE_PID" 2>/dev/null; then
  echo "[!] Zyte API failed to start"
  exit 1
fi

echo "[+] Starting Builder UI"
node ui/builder.js &

echo "[+] Starting Viewer UI"
node ui/viewer.js &

echo "[+] OK"
echo "Builder UI : http://127.0.0.1:8080"
echo "Viewer UI  : http://127.0.0.1:8081/viewer.html"
echo "API        : http://127.0.0.1:9090"

wait
