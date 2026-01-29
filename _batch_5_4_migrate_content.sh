#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="$ROOT/sources/what-is-a-source"
DEST="$ROOT/sources/amethyst/what-is-a-source"

if [ ! -f "$SRC/index.html" ]; then
  echo "[B5.4] ❌ Source index.html not found"
  exit 1
fi

cp "$SRC/index.html" "$DEST/index.html"

# copy optional asset folders
for DIR in media assets blocks; do
  if [ -d "$SRC/$DIR" ]; then
    cp -r "$SRC/$DIR" "$DEST/"
  fi
done

echo "[B5.4] ✔ Content migrated to Amethyst"
