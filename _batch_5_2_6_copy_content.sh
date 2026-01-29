#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="$ROOT/sources/portal"
DEST="$ROOT/sources/amethyst/portal"

echo "[B5.2.6] Copying portal → amethyst/portal"

if [ ! -d "$SRC" ]; then
  echo "❌ Source not found: $SRC"
  exit 1
fi

cp -r "$SRC"/* "$DEST"/

echo "[B5.2.6] ✔ Content copied (original untouched)"
