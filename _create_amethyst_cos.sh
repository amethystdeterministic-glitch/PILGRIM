#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
NAME="amethyst-cos"
SRC="$ROOT/sources/$NAME"

if [ -d "$SRC" ]; then
  echo "Source already exists: $NAME"
  exit 0
fi

mkdir -p "$SRC"/{blocks,media,about,sources,deterministic-law,company,portal}

cat << JSON > "$SRC/source.json"
{
  "source": "amethyst-cos",
  "version": "1.0.0",
  "default_page": "home"
}
JSON

cat << JSON > "$SRC/meta.json"
{
  "title": "Amethyst cOS",
  "description": "The sovereign deterministic operating system.",
  "visibility": "public",
  "order": 1
}
JSON

cat << HTML > "$SRC/blocks/nav.html"
<nav class="source-nav">
  <a href="./">Home</a>
  <span>·</span>
  <a href="./about/">About</a>
  <span>·</span>
  <a href="./sources/">Sources</a>
  <span>·</span>
  <a href="./deterministic-law/">Law</a>
  <span>·</span>
  <a href="./company/">Company</a>
  <span>·</span>
  <a href="./portal/">Portal</a>
</nav>
HTML

cat << CSS > "$SRC/blocks/style.css"
body {
  background:#0b0b0e;
  color:#e5e7eb;
  font-family:system-ui;
  margin:0;
  padding:2rem;
}
a { color:#9ae6ff; }
.source-nav { margin:1rem 0 2rem 0; }
.source-nav span { opacity:0.5; margin:0 0.4rem; }
CSS

cat << HTML > "$SRC/index.html"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Amethyst cOS</title>
  <link rel="stylesheet" href="./blocks/style.css">
</head>
<body>

<!-- block: nav -->

<h1>Amethyst cOS</h1>
<p>The sovereign deterministic operating system.</p>

</body>
</html>
HTML

cat "$SRC/blocks/nav.html" >> "$SRC/index.html"

echo "CANONICAL SOURCE CREATED: amethyst-cos"
