#!/usr/bin/env bash
set -euo pipefail

SOURCE_ID="${1:-}"
PAYLOAD_HASH="${2:-}"
PROOF_PATH="${3:--}"

LEDGER="source/runtime/source-ledger.ndjson"

[ -n "$SOURCE_ID" ] || { echo "BAD_SOURCE_ID" >&2; exit 1; }
[ -n "$PAYLOAD_HASH" ] || { echo "BAD_PAYLOAD_HASH" >&2; exit 1; }

mkdir -p "$(dirname "$LEDGER")"
touch "$LEDGER"

PREV_HASH="GENESIS"
LAST_LINE="$(tail -n 1 "$LEDGER" 2>/dev/null || true)"
if [ -n "$LAST_LINE" ]; then
  PREV_HASH="$(printf "%s" "$LAST_LINE" | sed -n 's/.*"entry_hash"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' | head -n 1)"
  [ -n "$PREV_HASH" ] || PREV_HASH="GENESIS"
fi

UTC="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
PREIMAGE="v1|${UTC}|${SOURCE_ID}|${PAYLOAD_HASH}|${PROOF_PATH}|${PREV_HASH}"
ENTRY_HASH="$(printf "%s" "$PREIMAGE" | sha256sum | awk '{print $1}')"

printf '{"schema":"amethyst.source.ledger.v1","utc":"%s","source_id":"%s","payload_hash":"%s","proof_path":"%s","prev_hash":"%s","entry_hash":"%s"}\n' \
  "$UTC" "$SOURCE_ID" "$PAYLOAD_HASH" "$PROOF_PATH" "$PREV_HASH" "$ENTRY_HASH" >> "$LEDGER"

echo "$ENTRY_HASH"
