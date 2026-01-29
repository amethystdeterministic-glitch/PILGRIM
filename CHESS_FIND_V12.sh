#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/amethyst"
OUT="$HOME/amethyst/runtime_v2/CHESS_V12_CANDIDATES.txt"

# Candidate roots
CANDIDATE_DIRS=(
  "$ROOT/freezes"
  "$ROOT/runtime_backup_"*
  "$ROOT/runtime_overreach_experiment"
)

# Multiplayer + Mundo fingerprints
PATTERNS=(
  "socket.io"
  "WebSocket"
  "ws://"
  "wss://"
  "roomId"
  "matchId"
  "lobby"
  "joinRoom"
  "createRoom"
  "playerId"
  "opponent"
  "mundo"
  "MUNDO"
)

echo "[1/4] Scanning for chess directories..."
TMP="$(mktemp)"

for base in "${CANDIDATE_DIRS[@]}"; do
  for b in $base; do
    [ -d "$b" ] || continue
    find "$b" -type d -iname "*chess*" 2>/dev/null >> "$TMP" || true
  done
done

mapfile -t DIRS < <(awk '!seen[$0]++' "$TMP")
rm -f "$TMP"

if [ "${#DIRS[@]}" -eq 0 ]; then
  echo "No chess directories found."
  exit 1
fi

echo "[2/4] Scoring candidates..."
: > "$OUT"

score_dir() {
  local d="$1"
  local score=0

  [ -f "$d/index.html" ] && score=$((score + 5))

  if find "$d" -maxdepth 2 -type f \( -iname "*.js" -o -iname "*.mjs" \) | grep -q .; then
    score=$((score + 3))
  fi

  for p in "${PATTERNS[@]}"; do
    if grep -R --fixed-strings "$p" "$d" >/dev/null 2>&1; then
      score=$((score + 1))
    fi
  done

  echo "$score|$d"
}

for d in "${DIRS[@]}"; do
  score_dir "$d" >> "$OUT"
done

echo "[3/4] Top candidates:"
sort -t'|' -nr "$OUT" | head -n 10 | nl -ba

BEST="$(sort -t'|' -nr "$OUT" | head -n 1 | cut -d'|' -f2-)"
BEST_SCORE="$(sort -t'|' -nr "$OUT" | head -n 1 | cut -d'|' -f1)"

echo
echo "[4/4] BEST CANDIDATE (score $BEST_SCORE):"
echo "$BEST"
echo
ls -la "$BEST" | sed -n '1,80p'
echo
echo "To restore into runtime_v2:"
echo "  mkdir -p ~/amethyst/runtime_v2/fun/chess"
echo "  rm -rf  ~/amethyst/runtime_v2/fun/chess/*"
echo "  cp -r \"$BEST\"/* ~/amethyst/runtime_v2/fun/chess/"
