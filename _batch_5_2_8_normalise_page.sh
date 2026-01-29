#!/bin/bash
set -e

PAGE="$HOME/amethyst/runtime_v2/sources/amethyst/amethyst-deterministic-ltd/index.html"

echo "[B5.2.8] Normalising Amethyst Deterministic Ltd page"

if [ ! -f "$PAGE" ]; then
  echo "❌ index.html missing"
  exit 1
fi

echo "<!-- PAGE: amethyst / amethyst-deterministic-ltd -->" >> "$PAGE"

echo "[B5.2.8] ✔ Page normalised"
