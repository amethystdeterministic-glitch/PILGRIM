#!/bin/bash
set -e

PAGE="$HOME/amethyst/runtime_v2/sources/amethyst/deterministic-law/index.html"

echo "[B5.2.9] Normalising Deterministic Law page"

if [ ! -f "$PAGE" ]; then
  echo "❌ index.html missing"
  exit 1
fi

echo "<!-- PAGE: amethyst / deterministic-law -->" >> "$PAGE"

echo "[B5.2.9] ✔ Page normalised"
