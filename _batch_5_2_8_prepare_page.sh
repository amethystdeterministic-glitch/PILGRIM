#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
DEST="$ROOT/sources/amethyst/amethyst-deterministic-ltd"

echo "[B5.2.8] Preparing page folder: $DEST"

mkdir -p "$DEST"
mkdir -p "$DEST/media"

echo "[B5.2.8] ✔ Page folder ready"
