#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SOURCES="$ROOT/sources"

echo "[FIX] Ensuring intro block exists for all Sources…"

for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  BLOCKS="$SRC/blocks"
  INTRO="$BLOCKS/intro.html"

  mkdir -p "$BLOCKS"

  if [ ! -f "$INTRO" ]; then
    NAME=$(basename "$SRC")
    TITLE=$(echo "$NAME" | tr '-' ' ' | sed 's/\b./\U&/g')

    cat << HTML > "$INTRO"
<section class="source-block intro-block">
  <h1>$TITLE</h1>

  <p>
    This Source is part of the Amethyst deterministic runtime.<br>
    Pages are composed, not rewritten.
  </p>
</section>
HTML

    echo "[FIX] Added intro block → $NAME"
  fi
done

echo "[FIX] Intro block normalisation complete"
