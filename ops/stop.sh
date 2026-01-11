#!/usr/bin/env bash
set -e

RUNTIME="$HOME/.amethyst-runtime"

[ -f "$RUNTIME/zyte.pid" ] && kill $(cat "$RUNTIME/zyte.pid") && rm "$RUNTIME/zyte.pid" || true
[ -f "$RUNTIME/ui.pid" ] && kill $(cat "$RUNTIME/ui.pid") && rm "$RUNTIME/ui.pid" || true

echo "[+] Stopped"
