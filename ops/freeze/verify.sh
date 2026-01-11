#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$ROOT"

sha256sum -c ops/freeze/manifest.sha256
echo "[+] Manifest verified"
