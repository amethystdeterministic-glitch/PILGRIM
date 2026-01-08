#!/bin/sh
set -e

echo "[VERIFY] Checking integrity manifest..."
sha256sum -c MANIFEST.sha256

echo "[VERIFY] Running deterministic verification..."
./bin/pilgrim-verifier proof.json

echo "[VERIFY] PASS — Deterministic Runtime Enforcement verified"
