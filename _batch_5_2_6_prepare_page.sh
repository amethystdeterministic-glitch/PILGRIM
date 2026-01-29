#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
DEST="$ROOT/sources/amethyst/portal"

echo "[B5.2.6] Preparing page folder: $DEST"

mkdir -p "$DEST"
mkdir -p "$DEST/media"

echo "[B5.2.6] ✔ Page folder ready"
