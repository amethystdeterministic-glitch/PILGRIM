#!/usr/bin/env bash
set -e

echo "ZYTE PID: $(cat /tmp/zyte.pid 2>/dev/null || echo stopped)"
echo "UI   PID: $(cat /tmp/ui.pid 2>/dev/null || echo stopped)"
ps -o pid,etime,cmd -p $(cat /tmp/zyte.pid 2>/dev/null) 2>/dev/null || true
ps -o pid,etime,cmd -p $(cat /tmp/ui.pid 2>/dev/null) 2>/dev/null || true
