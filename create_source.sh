#!/bin/sh
set -e

NAME="$1"

if [ -z "$NAME" ]; then
  echo "Usage: ./create_source.sh <source-name>"
  exit 1
fi

BASE="sources/$NAME"

mkdir -p "$BASE/content/assets"
mkdir -p "$BASE/build"

cat <<JSON > "$BASE/source.json"
{
  "name": "$NAME",
  "created_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "version": 1
}
JSON

cat <<MD > "$BASE/content/index.md"
# $NAME

This is your website.

Edit this file to change it.
MD

echo "Source created at $BASE"
