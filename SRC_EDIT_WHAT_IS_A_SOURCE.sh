#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/amethyst/runtime_v2"
SLUG="what-is-a-source"

echo "== Amethyst v2: open Source page for editing =="
echo

DIR="$ROOT/sources/$SLUG"

if [ -d "$DIR" ]; then
  if [ -f "$DIR/index.html" ]; then
    echo "Opening: $DIR/index.html"
    nano "$DIR/index.html"
    exit 0
  else
    echo "Folder exists but index.html is missing:"
    ls -la "$DIR" | sed -n '1,120p'
    exit 1
  fi
fi

echo "Not found at expected path:"
echo "  $DIR/index.html"
echo
echo "Searching for close matches under sources/..."
find "$ROOT/sources" -maxdepth 3 -type d -iname "*source*" 2>/dev/null | nl -ba || true
echo
echo "If the correct folder appears above, paste its path and I’ll give you a direct nano command."
exit 1
