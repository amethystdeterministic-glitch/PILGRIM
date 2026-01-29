#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="$ROOT/sources/what-is-a-source"
DEST="$ROOT/sources/amethyst/what-is-a-source"

echo "[B5.2.7] Copying what-is-a-source → amethyst/what-is-a-source"

if [ ! -d "$SRC" ]; then
  echo "❌ Source not found: $SRC"
  exit 1
fi

cp -r "$SRC"/* "$DEST"/

echo "[B5.2.7] ✔ Content copied (original untouched)"
