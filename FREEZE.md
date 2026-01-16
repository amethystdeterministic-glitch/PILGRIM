# 🔒 PORTAL FREEZE — 2026-01-13

## Status
**FROZEN / VERIFIED / CANONICAL**

This repository contains a frozen, verified working state of:

- Amethyst Portal (UI)
- Source Runtime (API @ :9190)
- Deterministic Source Ledger
- Cross-browser verification (Chrome + Opera)
- CORS, routing, and status resolution fully operational

Git tag:
portal-freeze-2026-01-13

## Why this freeze exists

This freeze exists because:

- The system was fully operational after extended debugging
- Reconstructing this state previously cost hours
- The architecture is deterministic and must be preserved as such
- Any future regression must be reversible instantly

This tag is **not optional**.
It is a **restore point**, not a suggestion.

## What is guaranteed at this tag

- Portal UI shows:
  - System: Available
  - Source Head: Ledger OK
  - Source Verify: Verified
- Runtime responds correctly at /api/source/status
- Source ledger integrity is intact

## Rules from this point forward

1. No edits on master without a new tag
2. Any experiment = branch or new tag
3. If something breaks: restore first, investigate second

## Restore command

git checkout portal-freeze-2026-01-13
AMETHYST PORTAL v1 — FROZEN Fri Jan 16 15:59:11 GMT 2026 — Source, Builder, Portal skeleton confirmed
