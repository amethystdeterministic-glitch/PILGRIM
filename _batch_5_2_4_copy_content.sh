#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="$ROOT/sources/amethyst-deterministic-ltd"
DEST="$ROOT/sources/amethyst/company"

echo "[B5.2.4] Copying source → page (dry-run)"

if [ ! -d "$SRC" ]; then
  echo "❌ Source not found: $SRC"
  exit 1
fi

cp -r "$SRC"/* "$DEST"/

echo "[B5.2.4] ✔ Content copied (original untouched)"
