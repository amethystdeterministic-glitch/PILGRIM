#!/bin/bash
set -e

NAME="$1"
ROOT=~/amethyst/runtime_v2/sources/$NAME

if [ -z "$NAME" ]; then
  echo "Usage: ./_source_template.sh <source-name>"
  exit 1
fi

mkdir -p $ROOT/{blocks,media,builder,about}

# source.json
cat << JSON > $ROOT/source.json
{
  "source": "$NAME",
  "version": "1.0.0",
  "default_page": "home"
}
JSON

# blocks
cp ~/amethyst/runtime_v2/sources/example/blocks/*.html $ROOT/blocks/
cp ~/amethyst/runtime_v2/sources/example/blocks/media.css $ROOT/blocks/

# index
cat << HTML > $ROOT/index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>$NAME</title>
  <link rel="stylesheet" href="./blocks/media.css">
</head>
<body>

<!-- block: nav -->
<!-- block: intro -->

</body>
</html>
HTML

cat $ROOT/blocks/nav.html >> $ROOT/index.html
cat $ROOT/blocks/intro.html >> $ROOT/index.html

# about
cat << HTML > $ROOT/about/index.html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>About – $NAME</title>
  <link rel="stylesheet" href="../blocks/media.css">
</head>
<body>

<!-- block: nav -->
<!-- block: about -->

</body>
</html>
HTML

cat $ROOT/blocks/nav.html >> $ROOT/about/index.html
cat $ROOT/blocks/about.html >> $ROOT/about/index.html

echo "SOURCE '$NAME' CREATED"
