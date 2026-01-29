#!/bin/bash
set -e

SRC=example
BASE=~/amethyst/runtime_v2/sources/$SRC

mkdir -p $BASE/pages
mkdir -p $BASE/assets/images
mkdir -p $BASE/assets/video
mkdir -p $BASE/assets/docs
mkdir -p $BASE/builder

cat << 'JSON' > $BASE/source.json
{
  "name": "Example Source",
  "version": "1.0.0",
  "created": "deterministic",
  "pages": ["home", "about", "contact"]
}
JSON

cat << 'HTML' > $BASE/index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Example Source</title>
</head>
<body>
  <h1>Example Source</h1>
  <p>This Source contains multiple pages.</p>
  <ul>
    <li><a href="/sources/example/pages/home.html">Home</a></li>
    <li><a href="/sources/example/pages/about.html">About</a></li>
    <li><a href="/sources/example/pages/contact.html">Contact</a></li>
  </ul>
</body>
</html>
HTML

for p in home about contact; do
cat << HTML > $BASE/pages/$p.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>$p</title>
</head>
<body>
  <h1>$p page</h1>
  <p>This page lives inside the Source Box.</p>
  <a href="/sources/example/">Back to Source</a>
</body>
</html>
HTML
done

cat << 'HTML' > $BASE/builder/index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Source Builder</title>
</head>
<body>
  <h1>Source Builder</h1>
  <p>This is the internal builder shell.</p>
  <p>Future: Lego blocks, media picker, page editor.</p>
</body>
</html>
HTML

echo "SOURCE BOX SCAFFOLD COMPLETE"
