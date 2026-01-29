#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="$ROOT/sources/amethyst-deterministic-ltd"
DEST="$ROOT/sources/amethyst/amethyst-deterministic-ltd"

echo "[B5.2.8] Copying amethyst-deterministic-ltd → amethyst/amethyst-deterministic-ltd"

if [ ! -d "$SRC" ]; then
  echo "❌ Source not found: $SRC"
  exit 1
fi

cp -r "$SRC"/* "$DEST"/

echo "[B5.2.8] ✔ Content copied (original untouched)"
