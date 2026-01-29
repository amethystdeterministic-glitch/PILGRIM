#!/bin/bash
set -e

SOURCE="$1"
PAGE="$2"

if [ -z "$SOURCE" ] || [ -z "$PAGE" ]; then
  echo "Usage: ./_page_template.sh <source> <page>"
  exit 1
fi

ROOT="$HOME/amethyst/runtime_v2/sources/$SOURCE"
PAGE_DIR="$ROOT/$PAGE"

if [ ! -d "$ROOT" ]; then
  echo "Source does not exist"
  exit 1
fi

if [ -d "$PAGE_DIR" ]; then
  echo "Page already exists"
  exit 1
fi

mkdir -p "$PAGE_DIR"

cat << HTML > "$PAGE_DIR/index.html"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>$PAGE</title>
  <link rel="stylesheet" href="../blocks/media.css">
</head>
<body>

<nav>
  <a href="../">Home</a>
</nav>

<h1>$PAGE</h1>
<p>This page belongs to the <strong>$SOURCE</strong> Source.</p>

</body>
</html>
HTML

echo "PAGE '$PAGE' CREATED IN SOURCE '$SOURCE'"
