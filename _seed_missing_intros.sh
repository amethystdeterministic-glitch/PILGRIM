#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SOURCES="$ROOT/sources"

echo "[SEED] Ensuring intro blocks exist…"

for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  NAME=$(basename "$SRC")
  INTRO="$SRC/blocks/intro.html"

  if [ ! -f "$INTRO" ]; then
    cat << HTML > "$INTRO"
<section class="intro">
  <h1>$NAME</h1>
  <p>
    This Source is part of the Amethyst deterministic runtime.
    Pages are composed, not rewritten.
  </p>
</section>
HTML

    echo "[SEED] intro created → $NAME"
  fi
done

echo "[SEED] Intro enforcement complete"
