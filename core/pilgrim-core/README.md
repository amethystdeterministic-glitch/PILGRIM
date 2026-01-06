# PILGRIM

## Project Status

**Status:** Stable / Frozen Core  
**Current Release:** v1.0-frozen  
**Last Verified:** January 2026

PILGRIM Core is a deterministic execution engine designed for provable,
auditable and reproducible computation.

The core is intentionally frozen at v1.0 to serve as a stable,
verifiable foundation.

Active development continues in higher-level systems (including
Amethyst Browser and future Amethyst cOS components), which
consume PILGRIM as a licensed engine rather than modifying it directly.

No breaking changes are planned for the core without a formal
versioned release.

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
