#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
REGISTRY="$ROOT/sources/_registry.json"

echo "{" > "$REGISTRY"
echo '  "version": "1.2.1",' >> "$REGISTRY"
echo '  "sources": [' >> "$REGISTRY"

FIRST=true
for SRC in "$ROOT"/sources/*; do
  if [ -d "$SRC" ] && [ -f "$SRC/meta.json" ]; then
    NAME=$(basename "$SRC")

    TITLE=$(sed -n 's/.*"title"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SRC/meta.json")
    DESC=$(sed -n 's/.*"description"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SRC/meta.json")
    VIS=$(sed -n 's/.*"visibility"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' "$SRC/meta.json")
    ORDER=$(sed -n 's/.*"order"[[:space:]]*:[[:space:]]*\([0-9]*\).*/\1/p' "$SRC/meta.json")

    [ "$VIS" != "public" ] && continue

    if [ "$FIRST" = false ]; then echo "    ," >> "$REGISTRY"; fi
    FIRST=false

    cat << JSON >> "$REGISTRY"
    {
      "id": "$NAME",
      "title": "$TITLE",
      "description": "$DESC",
      "order": $ORDER,
      "path": "/sources/$NAME/"
    }
JSON
  fi
done

echo "  ]" >> "$REGISTRY"
echo "}" >> "$REGISTRY"

echo "SOURCE REGISTRY BUILT (ordered, public)"
