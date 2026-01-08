
#!/usr/bin/env bash
set -euo pipefail

# ===============================
# Amethyst Browser Session Runner
# Deterministic + Verifiable
# ===============================

URL="${1:-}"
SUBJECT="${2:-}"

if [ -z "$URL" ] || [ -z "$SUBJECT" ]; then
  echo "[AMETHYST] Usage: run_browser_session.sh <url> <subject>"
  exit 1
fi

ROOT="$(pwd)"
PROOF="$ROOT/generated/amethyst-browser-android/proof.json"
VERIFIER="$ROOT/target/debug/pilgrim-verifier"

echo "[AMETHYST] Repo root: $ROOT"
echo "[AMETHYST] URL=$URL"
echo "[AMETHYST] SUBJECT=$SUBJECT"

# -------------------------------
# Build all components
# -------------------------------
cargo build -p ghostpass-core
cargo build -p zyte-core
cargo build -p amethyst-browser
cargo build -p pilgrim-verifier

# -------------------------------
# Run browser (writes proof)
# -------------------------------
cargo run -p amethyst-browser -- "$URL" "$SUBJECT"

# -------------------------------
# Proof existence check
# -------------------------------
if [ ! -f "$PROOF" ]; then
  echo "[VERIFY] Missing proof file: $PROOF"
  exit 1
fi

# -------------------------------
# Deterministic verification
# (CORRECT: single argument)
# -------------------------------
echo "[VERIFY] Running pilgrim-verifier"
"$VERIFIER" "$PROOF"

echo "[AMETHYST] PASS — Browser session + proof verified"
