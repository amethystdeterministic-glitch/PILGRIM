#!/bin/bash
set -e

PAGE="$HOME/amethyst/runtime_v2/sources/amethyst/law"

echo "[B5.2.5] Normalising Deterministic Law page"

if [ ! -f "$PAGE/index.html" ]; then
  echo "❌ index.html missing"
  exit 1
fi

echo "<!-- PAGE: amethyst / law -->" >> "$PAGE/index.html"

echo "[B5.2.5] ✔ Page normalised"
