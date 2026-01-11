#!/usr/bin/env bash
set -e

TS="$(date -u +%Y%m%dT%H%M%SZ)"
mkdir -p ops/logs/archive

[ -f /tmp/zyte.log ] && mv /tmp/zyte.log "ops/logs/archive/zyte_$TS.log" || true
[ -f /tmp/ui.log ] && mv /tmp/ui.log "ops/logs/archive/ui_$TS.log" || true

touch /tmp/zyte.log /tmp/ui.log
echo "[+] Logs rotated at $TS"
