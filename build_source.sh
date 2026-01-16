#!/bin/sh
set -e

NAME="$1"

if [ -z "$NAME" ]; then
  echo "Usage: ./build_source.sh <source-name>"
  exit 1
fi

BASE="sources/$NAME"
RAW="$BASE/content/index.html.raw"
MD="$BASE/content/index.md"
OUT="$BASE/build/index.html"

if [ -f "$RAW" ]; then
  cat <<HTML > "$OUT"
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>$NAME</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
HTML

  cat "$RAW" >> "$OUT"

  cat <<HTML >> "$OUT"
</body>
</html>
HTML

  echo "Built from raw HTML"

elif [ -f "$MD" ]; then
  cat <<HTML > "$OUT"
<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>$NAME</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
HTML

  sed 's/^# \(.*\)/<h1>\1<\/h1>/' "$MD" >> "$OUT"

  cat <<HTML >> "$OUT"
</body>
</html>
HTML

  echo "Built from markdown"

else
  echo "No content found"
  exit 1
fi
