#!/bin/bash
set -e

PAGE="$HOME/amethyst/runtime_v2/sources/amethyst/what-is-a-source/index.html"

echo "[B5.2.7] Normalising What Is a Source page"

if [ ! -f "$PAGE" ]; then
  echo "❌ index.html missing"
  exit 1
fi

echo "<!-- PAGE: amethyst / what-is-a-source -->" >> "$PAGE"

echo "[B5.2.7] ✔ Page normalised"
