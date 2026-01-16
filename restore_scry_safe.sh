#!/bin/sh
set -e

PAGES="source pipeline guards settings write matrix post mundo forge"

for d in $PAGES; do
  f="$d/index.html"
  [ -f "$f" ] || continue

  # If SCRY already exists, skip
  grep -q 'scry.js' "$f" && continue

  # Inject SCRY before closing body
  sed -i 's|</body>|<script src="/ui/scry.js"></script>\n</body>|' "$f"
done
