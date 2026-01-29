#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/amethyst/runtime_v2"
SLUG="familyguard"

echo "== Amethyst v2: locate Source route =="
echo "Route you gave: /sources/$SLUG/"
echo

echo "[1/3] Searching under: $ROOT"
mapfile -t CANDS < <(
  find "$ROOT" -type d -iname "$SLUG" 2>/dev/null | sed 's|//|/|g' || true
)

if [ "${#CANDS[@]}" -eq 0 ]; then
  echo "No directory named '$SLUG' found inside runtime_v2."
  echo
  echo "Fallback: searching for files containing '/sources/$SLUG'..."
  grep -R --line-number --fixed-strings "/sources/$SLUG" "$ROOT" 2>/dev/null | head -n 40 || true
  exit 1
fi

echo "[2/3] Candidate directories:"
i=0
for d in "${CANDS[@]}"; do
  i=$((i+1))
  echo "  $i) $d"
done
echo

# Prefer sources/familyguard first if present
BEST=""
for d in "${CANDS[@]}"; do
  if echo "$d" | grep -q "/sources/$SLUG"; then
    BEST="$d"
    break
  fi
done
# Otherwise take the first
if [ -z "$BEST" ]; then BEST="${CANDS[0]}"; fi

echo "[3/3] Using:"
echo "  $BEST"
echo

if [ -f "$BEST/index.html" ]; then
  echo "Opening: $BEST/index.html"
  nano "$BEST/index.html"
  exit 0
fi

echo "No index.html in that folder. Listing files:"
ls -la "$BEST" | sed -n '1,120p'
echo
echo "If the page is a single file route, we may need to edit a different file."
echo "Run this next and paste the output back here:"
echo "  find \"$BEST\" -maxdepth 2 -type f -print 2>/dev/null"
