#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/amethyst/runtime_v2"
SLUG="tiers"
FILE="$ROOT/sources/$SLUG/index.html"

echo "== Amethyst v2 :: Edit Source → TIERS =="
echo

if [ -f "$FILE" ]; then
  echo "Opening:"
  echo "  $FILE"
  echo
  nano "$FILE"
  exit 0
fi

echo "❌ index.html not found at:"
echo "  $FILE"
echo
echo "Listing available sources for verification:"
ls -la "$ROOT/sources" | sed -n '1,200p'
exit 1
