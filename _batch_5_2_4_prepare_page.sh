#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
DEST="$ROOT/sources/amethyst/company"

echo "[B5.2.4] Preparing page folder: $DEST"

mkdir -p "$DEST"
mkdir -p "$DEST/media"

echo "[B5.2.4] ✔ Page folder ready"
