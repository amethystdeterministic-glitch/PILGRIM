#!/bin/bash
set -e

PAGE="$HOME/amethyst/runtime_v2/sources/amethyst/portal"

echo "[B5.2.6] Normalising Portal page"

if [ ! -f "$PAGE/index.html" ]; then
  echo "❌ index.html missing"
  exit 1
fi

echo "<!-- PAGE: amethyst / portal -->" >> "$PAGE/index.html"

echo "[B5.2.6] ✔ Page normalised"
