#!/bin/bash
set -e

META="$HOME/amethyst/runtime_v2/sources/what-is-a-source/meta.json"

cat << 'JSON' > "$META"
{
  "title": "What Is a Source (Archived)",
  "visibility": "private",
  "archived": true
}
JSON

echo "[B5.4] ✔ Old source archived (not deleted)"
