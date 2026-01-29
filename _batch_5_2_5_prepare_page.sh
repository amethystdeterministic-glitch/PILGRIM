#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
DEST="$ROOT/sources/amethyst/law"

echo "[B5.2.5] Preparing page folder: $DEST"

mkdir -p "$DEST"
mkdir -p "$DEST/media"

echo "[B5.2.5] ✔ Page folder ready"
