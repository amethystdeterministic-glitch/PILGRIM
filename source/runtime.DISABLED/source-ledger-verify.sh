#!/usr/bin/env bash
set -euo pipefail

LEDGER="source/runtime/source-ledger.ndjson"
[ -f "$LEDGER" ] || { echo "NO_LEDGER" >&2; exit 1; }

EXPECTED_PREV="GENESIS"
LINE_NO=0

while IFS= read -r LINE; do
  LINE_NO=$((LINE_NO + 1))
  [ -n "$LINE" ] || continue

  UTC="$(printf "%s" "$LINE" | sed -n 's/.*"utc":"\([^"]*\)".*/\1/p')"
  SOURCE_ID="$(printf "%s" "$LINE" | sed -n 's/.*"source_id":"\([^"]*\)".*/\1/p')"
  PAYLOAD_HASH="$(printf "%s" "$LINE" | sed -n 's/.*"payload_hash":"\([^"]*\)".*/\1/p')"
  PROOF_PATH="$(printf "%s" "$LINE" | sed -n 's/.*"proof_path":"\([^"]*\)".*/\1/p')"
  PREV_HASH="$(printf "%s" "$LINE" | sed -n 's/.*"prev_hash":"\([^"]*\)".*/\1/p')"
  ENTRY_HASH="$(printf "%s" "$LINE" | sed -n 's/.*"entry_hash":"\([^"]*\)".*/\1/p')"

  [ -n "$UTC" ] || { echo "BAD_UTC line=$LINE_NO" >&2; exit 1; }
  [ -n "$SOURCE_ID" ] || { echo "BAD_SOURCE_ID line=$LINE_NO" >&2; exit 1; }
  [ -n "$PAYLOAD_HASH" ] || { echo "BAD_PAYLOAD_HASH line=$LINE_NO" >&2; exit 1; }
  [ -n "$PROOF_PATH" ] || PROOF_PATH="-"
  [ -n "$PREV_HASH" ] || { echo "BAD_PREV_HASH line=$LINE_NO" >&2; exit 1; }
  [ -n "$ENTRY_HASH" ] || { echo "BAD_ENTRY_HASH line=$LINE_NO" >&2; exit 1; }

  if [ "$PREV_HASH" != "$EXPECTED_PREV" ]; then
    echo "CHAIN_BREAK line=$LINE_NO expected_prev=$EXPECTED_PREV got_prev=$PREV_HASH" >&2
    exit 1
  fi

  PREIMAGE="v1|${UTC}|${SOURCE_ID}|${PAYLOAD_HASH}|${PROOF_PATH}|${PREV_HASH}"
  COMPUTED="$(printf "%s" "$PREIMAGE" | sha256sum | awk '{print $1}')"

  if [ "$COMPUTED" != "$ENTRY_HASH" ]; then
    echo "HASH_MISMATCH line=$LINE_NO computed=$COMPUTED got=$ENTRY_HASH" >&2
    exit 1
  fi

  EXPECTED_PREV="$ENTRY_HASH"
done < "$LEDGER"

echo "SOURCE_LEDGER_VERIFIED"
