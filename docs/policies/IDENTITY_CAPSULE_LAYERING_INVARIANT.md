# Identity Capsule Layering Invariant (Canonical)

## Status
Frozen · Canonical · Architecture-Defining

## Scope
This document defines the immutable layering model of the Amethyst
Identity Capsule and governs how identity signals may be introduced,
combined, or revoked.

This invariant applies to:
- GhostPass
- Roster
- Biometric attestations
- Future identity extensions

---

## Identity Capsule Model

The Identity Capsule is a layered construct.

Each layer:
- Has a defined role
- Has explicit boundaries
- Cannot substitute another layer

---

## Canonical Layers

### Layer 1 — Core Identity
- Cryptographic keys
- Deterministic identifiers
- Non-biometric
- Non-revocable without identity destruction

### Layer 2 — Capability & History (Roster)
- Skills
- Roles
- Credentials
- Time-bound attestations
- Accretive, not substitutive

### Layer 3 — Access Convenience (GhostPass)
- Session continuity
- Authentication reduction
- Zero authority amplification
- No identity strengthening

### Layer 4 — Regulated Attestations (Biometric)
- Facial recognition
- Fingerprints
- Retinal / iris scan
- Multimodal fusion

Biometric layers are:
- Optional
- Jurisdiction-bound
- Explicitly consented
- Revocable without identity loss

---

## Prohibited Behavior

The following are forbidden:
- Using biometrics as sole identity proof
- Silent escalation of trust via biometric signals
- Persisting biometric material inside identity core
- Cross-layer substitution

---

## Invariant Statement

> Identity strength is additive, never substitutive.

> Biometric signals are attestations,
> not identity.

Any system violating this invariant is non-compliant with Amethyst Canon.

