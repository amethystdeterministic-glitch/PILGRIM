#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="$ROOT/sources/what-is-a-source"
DEST="$ROOT/sources/amethyst/what-is-a-source"

echo "[B5.2.2] Copying source → page (dry-run copy)"

if [ ! -d "$SRC" ]; then
  echo "❌ Source not found: $SRC"
  exit 1
fi

cp -r "$SRC"/* "$DEST"/

echo "[B5.2.2] ✔ Content copied (original untouched)"
