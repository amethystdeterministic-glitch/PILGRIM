#!/usr/bin/env bash
set -e

TEMPLATE="templates/source-default.html"
SOURCES_DIR="sources"

if [ ! -f "$TEMPLATE" ]; then
  echo "ERROR: Default source template missing"
  exit 1
fi

mkdir -p "$SOURCES_DIR"

for SRC in "$SOURCES_DIR"/*; do
  if [ -d "$SRC" ]; then
    if [ ! -f "$SRC/index.html" ]; then
      cp "$TEMPLATE" "$SRC/index.html"
      echo "Initialized source: $(basename "$SRC")"
    fi
  fi
done

echo "Source normalization complete."
