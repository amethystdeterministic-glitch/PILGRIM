#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="what-is-a-source"
DEST="$ROOT/sources/amethyst/what-is-a-source"

echo "[B5.2.2] Preparing page folder: $DEST"

mkdir -p "$DEST"
mkdir -p "$DEST/media"

echo "[B5.2.2] ✔ Page folder ready"
