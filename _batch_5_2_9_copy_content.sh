#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="$ROOT/sources/deterministic-law"
DEST="$ROOT/sources/amethyst/deterministic-law"

echo "[B5.2.9] Copying deterministic-law → amethyst/deterministic-law"

if [ ! -d "$SRC" ]; then
  echo "❌ Source not found: $SRC"
  exit 1
fi

cp -r "$SRC"/* "$DEST"/

echo "[B5.2.9] ✔ Content copied (original untouched)"
