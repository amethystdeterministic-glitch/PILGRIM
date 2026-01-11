#!/usr/bin/env bash
set -e

TS="$(date -u +%Y%m%dT%H%M%SZ)"
DEST="ops/backups/backup_$TS.tgz"

tar -czf "$DEST" \
  zyte/storage \
  zyte/index \
  zyte/history \
  zyte/zox \
  zyte/proofchain \
  zyte/audit \
  zyte/snapshot \
  zyte/FROZEN_FINAL.txt

echo "[+] Backup created: $DEST"
