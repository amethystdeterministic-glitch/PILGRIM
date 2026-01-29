#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SOURCES="$ROOT/sources"

# ===============================
# BATCH 21 — SOURCE NAV GENERATOR
# ===============================
for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  NAV="$SRC/blocks/nav.html"
  echo '<nav class="source-nav">' > "$NAV"

  for PAGE in "$SRC"/*; do
    [ -d "$PAGE" ] || continue
    NAME=$(basename "$PAGE")
    [ "$NAME" = "blocks" ] && continue
    [ "$NAME" = "media" ] && continue
    [ "$NAME" = "builder" ] && continue
    [ "$NAME" = "v1" ] && continue

    LABEL=$(echo "$NAME" | tr '-' ' ' | sed 's/\b./\U&/g')
    echo "<a href=\"./$NAME/\">$LABEL</a><span> · </span>" >> "$NAV"
  done

  echo '</nav>' >> "$NAV"
done

# ===============================
# BATCH 22 — DEFAULT PAGE BOOTSTRAP
# ===============================
for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  INDEX="$SRC/index.html"
  if ! grep -q "source-nav" "$INDEX"; then
    cat << HTML > "$INDEX"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>$(basename "$SRC")</title>
  <link rel="stylesheet" href="./blocks/media.css">
</head>
<body>

<!-- block: nav -->
<!-- block: intro -->

</body>
</html>
HTML
    cat "$SRC/blocks/nav.html" >> "$INDEX"
    cat "$SRC/blocks/intro.html" >> "$INDEX"
  fi
done

# ===============================
# BATCH 23 — PAGE INDEX NORMALISER
# ===============================
for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  for PAGE in "$SRC"/*; do
    [ -d "$PAGE" ] || continue
    NAME=$(basename "$PAGE")
    [ "$NAME" = "blocks" ] && continue
    [ "$NAME" = "media" ] && continue
    [ "$NAME" = "builder" ] && continue
    [ "$NAME" = "v1" ] && continue

    IDX="$PAGE/index.html"
    if [ ! -f "$IDX" ]; then
      cat << HTML > "$IDX"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>$NAME</title>
  <link rel="stylesheet" href="../blocks/media.css">
</head>
<body>

<!-- block: nav -->

</body>
</html>
HTML
      cat "$SRC/blocks/nav.html" >> "$IDX"
    fi
  done
done

# ===============================
# BATCH 24 — FINAL REGISTRY REBUILD
# ===============================
"$ROOT/_build_sources_registry.sh"

echo "BATCH 21–24 COMPLETE"
