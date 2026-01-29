#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SRC="$ROOT/sources/amethyst"

echo "[B5.2.1] Creating canonical AMETHYST source..."

mkdir -p "$SRC/blocks"
mkdir -p "$SRC/media"
mkdir -p "$SRC/builder"

# Future pages (empty for now)
mkdir -p "$SRC/portal"
mkdir -p "$SRC/what-is-a-source"
mkdir -p "$SRC/deterministic-law"
mkdir -p "$SRC/amethyst-deterministic-ltd"
mkdir -p "$SRC/tiers"

echo "[B5.2.1] ✔ Directory scaffold created"
