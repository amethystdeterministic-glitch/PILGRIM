#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/amethyst/runtime_v2"
SLUG1="deterministic-law"
SLUG2="deterministic_law"

echo "== Amethyst v2: open Deterministic Law source for editing =="
echo

pick_and_open () {
  local slug="$1"
  local dir="$ROOT/sources/$slug"
  if [ -d "$dir" ]; then
    if [ -f "$dir/index.html" ]; then
      echo "Opening: $dir/index.html"
      nano "$dir/index.html"
      exit 0
    fi
    echo "Found folder but no index.html: $dir"
    ls -la "$dir" | sed -n '1,120p'
    exit 1
  fi
}

pick_and_open "$SLUG1"
pick_and_open "$SLUG2"

echo "Not found at:"
echo "  $ROOT/sources/$SLUG1/index.html"
echo "  $ROOT/sources/$SLUG2/index.html"
echo
echo "Searching runtime_v2 for matching folders..."
find "$ROOT/sources" -maxdepth 3 -type d \( -iname "$SLUG1" -o -iname "$SLUG2" -o -iname "*deterministic*law*" \) 2>/dev/null | sed 's|//|/|g' | nl -ba || true
echo
echo "If you see the correct folder above, paste its path here and I’ll give you a direct nano command."
exit 1
