# Amethyst UI Layer (Client)

This directory contains **presentation-only** surfaces.

Rules:
- No business logic
- No enforcement logic
- No authority decisions
- No inference
- No tracking

All data is read-only from:
- ZITE
- Gateway
- Pilgrim Core

If the UI breaks:
→ the system is still valid.

If the backend breaks:
→ the UI is irrelevant.
