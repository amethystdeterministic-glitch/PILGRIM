#!/bin/bash
set -e

BASE=~/amethyst/runtime_v2/sources/example

mkdir -p $BASE/blocks
mkdir -p $BASE/pages/home

cat << 'JSON' > $BASE/pages/home/page.json
{
  "title": "Home",
  "blocks": [
    "hero",
    "text",
    "cta"
  ]
}
JSON

cat << 'HTML' > $BASE/blocks/hero.html
<section>
  <h1>Example Source</h1>
  <p>This page is rendered from Source Blocks.</p>
</section>
HTML

cat << 'HTML' > $BASE/blocks/text.html
<section>
  <p>
    Each block is a deterministic unit.  
    Pages are composed, not rewritten.
  </p>
</section>
HTML

cat << 'HTML' > $BASE/blocks/cta.html
<section>
  <a href="/sources/example/builder/">Open Source Builder</a>
</section>
HTML

cat << 'HTML' > $BASE/pages/home/index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Example — Home</title>
</head>
<body>
  <!-- BLOCK: hero -->
  <!-- BLOCK: text -->
  <!-- BLOCK: cta -->
</body>
</html>
HTML

echo "SOURCE BLOCK SYSTEM INITIALISED"
