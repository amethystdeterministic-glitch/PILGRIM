#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2/sources/amethyst-cos"
PAGE="$1"
TITLE="$2"

if [ -z "$PAGE" ] || [ -z "$TITLE" ]; then
  echo "Usage: ./_cos_page_template.sh <folder> <title>"
  exit 1
fi

cat << HTML > "$ROOT/$PAGE/index.html"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>$TITLE – Amethyst cOS</title>
  <link rel="stylesheet" href="../blocks/media.css">
</head>
<body>

<!-- block: nav -->

<h1>$TITLE</h1>

<p>Content loading.</p>

</body>
</html>
HTML

cat "$ROOT/blocks/nav.html" >> "$ROOT/$PAGE/index.html"

echo "Page created: $PAGE"
