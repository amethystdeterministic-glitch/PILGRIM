# PILGRIM

PILGRIM is a deterministic enforcement engine designed to make rule violations mechanically impossible.

It replaces trust-based, policy-enforced systems with execution governed by invariant physics: if a rule is violated, execution halts.

---

## Scope

This repository contains the Pilgrim Core engine only.

It does not include browsers, user interfaces, platforms, or applications.

---

## Design Principles

- Deterministic execution
- Explicit invariant enforcement
- No heuristics
- No overrides
- No trust assumptions
- Reproducibility by construction

---

## Status

This repository includes a frozen reference release:

- **v1.0-frozen** — canonical baseline for audit and verification

Future work will occur only under explicitly versioned releases.

---

## Platform Relationship

PILGRIM is a licensable engine.

Higher-level systems such as **Amethyst Browser**, **ZITE**, **Pulse**, and **Amethyst cOS HUE** are built on top of PILGRIM and are not part of this repository.

---

## License

See `LICENSE`.
