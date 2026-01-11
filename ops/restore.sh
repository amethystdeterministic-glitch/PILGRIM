#!/usr/bin/env bash
set -e

if [ -z "$1" ]; then
  echo "Usage: ops/restore.sh <backup.tgz>"
  exit 1
fi

tar -xzf "$1"
echo "[+] Restore complete from $1"
