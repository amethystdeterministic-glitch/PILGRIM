#!/bin/bash
set -e

PAGE="$HOME/amethyst/runtime_v2/sources/amethyst/company"

echo "[B5.2.4] Normalising page index"

if [ ! -f "$PAGE/index.html" ]; then
  echo "❌ index.html missing"
  exit 1
fi

echo "<!-- PAGE: amethyst / company -->" >> "$PAGE/index.html"

echo "[B5.2.4] ✔ Page normalised"
