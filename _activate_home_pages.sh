#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SOURCES="$ROOT/sources"

echo "[ACTIVATE] Enforcing home page per Source…"

for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  NAME=$(basename "$SRC")
  BLOCKS="$SRC/blocks"
  HOME="$SRC/home"
  INDEX="$SRC/index.html"

  mkdir -p "$HOME"

  # --- home page content ---
  if [ ! -f "$HOME/index.html" ]; then
    cat << HTML > "$HOME/index.html"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>$NAME</title>
  <link rel="stylesheet" href="../blocks/media.css">
</head>
<body>

<!-- block: nav -->
<!-- block: intro -->

</body>
</html>
HTML

    cat "$BLOCKS/nav.html" >> "$HOME/index.html"
    cat "$BLOCKS/intro.html" >> "$HOME/index.html"

    echo "[ACTIVATE] Home page created → $NAME"
  fi

  # --- root index becomes router ---
  cat << HTML > "$INDEX"
<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0; url=./home/">
</head>
<body></body>
</html>
HTML

done

echo "[ACTIVATE] Home pages enforced for all Sources"
