#!/bin/sh
set -e

PAGES="source pipeline guards settings write matrix post mundo forge"

for d in $PAGES; do
  f="$d/index.html"
  [ -f "$f" ] || continue

  # Remove all inline scripts
  sed -i '/<script>/,/<\/script>/d' "$f"

  # Inject SCRY once before closing body
  sed -i 's|</body>|<script src="/ui/scry.js"></script>\n</body>|' "$f"
done
