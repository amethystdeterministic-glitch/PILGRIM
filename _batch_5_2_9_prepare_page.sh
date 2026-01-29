#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
DEST="$ROOT/sources/amethyst/deterministic-law"

echo "[B5.2.9] Preparing page folder: $DEST"

mkdir -p "$DEST"
mkdir -p "$DEST/media"

echo "[B5.2.9] ✔ Page folder ready"
