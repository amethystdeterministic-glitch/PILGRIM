#!/bin/bash
set -e

PAGE="$HOME/amethyst/runtime_v2/sources/amethyst/what-is-a-source"

echo "[B5.2.2] Normalising page index"

if [ ! -f "$PAGE/index.html" ]; then
  echo "❌ index.html missing in page"
  exit 1
fi

# No edits to content — just confirmation marker
echo "<!-- PAGE: amethyst / what-is-a-source -->" >> "$PAGE/index.html"

echo "[B5.2.2] ✔ Page normalised"
