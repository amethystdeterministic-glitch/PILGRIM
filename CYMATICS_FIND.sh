#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/amethyst"
OUT="$HOME/amethyst/runtime_v2/CYMATICS_CANDIDATES.txt"

# Build candidate roots safely
CANDIDATE_DIRS=()

[ -d "$ROOT/freezes" ] && CANDIDATE_DIRS+=("$ROOT/freezes")
[ -d "$ROOT/runtime_overreach_experiment" ] && CANDIDATE_DIRS+=("$ROOT/runtime_overreach_experiment")

for d in "$ROOT"/runtime_backup_*; do
  [ -d "$d" ] && CANDIDATE_DIRS+=("$d")
done

for d in "$ROOT/freezes"/*/runtime; do
  [ -d "$d" ] && CANDIDATE_DIRS+=("$d")
done

for d in "$ROOT/freezes"/*/runtime/backups; do
  [ -d "$d" ] && CANDIDATE_DIRS+=("$d")
done

NAME_HINTS=(
  "cymatic"
  "cymatics"
  "audio"
  "sound"
  "frequency"
  "oscillator"
  "visual"
  "wave"
  "fft"
  "tone"
)

CODE_PATTERNS=(
  "AudioContext"
  "webkitAudioContext"
  "createOscillator"
  "createAnalyser"
  "getByteFrequencyData"
  "getFloatFrequencyData"
  "fftSize"
  "analyser"
  "oscillator"
  "canvas"
  "WebGL"
  "requestAnimationFrame"
  "frequency"
  "solfeggio"
)

echo "[1/4] Scanning for cymatics-like directories..."
tmp="$(mktemp)"

for base in "${CANDIDATE_DIRS[@]}"; do
  for hint in "${NAME_HINTS[@]}"; do
    find "$base" -type d -iname "*$hint*" 2>/dev/null >> "$tmp" || true
  done
done

mapfile -t DIRS < <(awk '!seen[$0]++' "$tmp")
rm -f "$tmp"

if [ "${#DIRS[@]}" -eq 0 ]; then
  echo "No cymatics candidates found."
  exit 1
fi

echo "[2/4] Scoring candidates..."
: > "$OUT"

score_dir() {
  local d="$1"
  local score=0

  [ -f "$d/index.html" ] && score=$((score + 5))

  if find "$d" -maxdepth 2 -type f \( -iname "*.js" -o -iname "*.html" \) 2>/dev/null | grep -q .; then
    score=$((score + 3))
  fi

  local hits=0
  for p in "${CODE_PATTERNS[@]}"; do
    if grep -R --fixed-strings "$p" "$d" 2>/dev/null | head -n 1 >/dev/null; then
      hits=$((hits + 1))
    fi
  done

  score=$((score + hits))

  echo "$d" | grep -q "/fun/"  && score=$((score + 4))
  echo "$d" | grep -q "/apps/" && score=$((score + 2))

  echo "$score|$d"
}

for d in "${DIRS[@]}"; do
  score_dir "$d" >> "$OUT"
done

echo "[3/4] Top candidates:"
sort -t'|' -nr "$OUT" | head -n 12 | nl -ba

BEST="$(sort -t'|' -nr "$OUT" | head -n 1 | cut -d'|' -f2-)"
BEST_SCORE="$(sort -t'|' -nr "$OUT" | head -n 1 | cut -d'|' -f1)"

echo
echo "[4/4] BEST CANDIDATE (score $BEST_SCORE):"
echo "$BEST"
echo
echo "Preview:"
ls -la "$BEST" | sed -n '1,80p'
echo
echo "To restore into runtime_v2 FUN:"
echo "  mkdir -p \"$HOME/amethyst/runtime_v2/fun/cymatics\""
echo "  rm -rf  \"$HOME/amethyst/runtime_v2/fun/cymatics\"/*"
echo "  cp -r \"$BEST\"/* \"$HOME/amethyst/runtime_v2/fun/cymatics/\""
