#!/usr/bin/env bash
set -e

ROOT="$HOME/amethyst/runtime_v2"

echo "[DTN B1] Creating Source Box foundation directories..."

mkdir -p "$ROOT/sources/.system"
mkdir -p "$ROOT/sources/.system/media"
mkdir -p "$ROOT/sources/.system/pages"
mkdir -p "$ROOT/sources/.system/builder"

echo "[DTN B1] ✔ Base Source system directories created"
