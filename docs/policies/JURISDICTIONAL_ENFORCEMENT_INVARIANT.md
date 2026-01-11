# Jurisdictional Enforcement Invariant (Canonical)

## Status
Frozen · Canonical · Audit-Grade

## Scope
This document defines how Amethyst systems deterministically enforce
jurisdictional constraints across Identity, Proof, Runtime, and Enterprise
deployments.

This invariant applies to:
- Identity Capsule
- Deterministic Proof™
- Pilgrim / Guard enforcement
- Enterprise and regulated deployments

---

## Core Principle

> Jurisdiction is not configuration.
> Jurisdiction is an enforced system invariant.

Any system behavior that varies by jurisdiction MUST be:
- Explicit
- Deterministic
- Auditable
- Non-bypassable

---

## Jurisdiction Classes

### **EU**
- Privacy-first
- Biometric features disabled by default
- Explicit, revocable consent required
- GDPR / eIDAS aligned
- Silent activation is forbidden

### **US**
- Opt-in only
- Explicit consent required
- Sector-specific overlays permitted (finance, healthcare, defense)
- No implicit escalation of identity strength

### **APAC**
- Policy-defined
- Deployment-specific enforcement
- Explicit regional configuration required
- Defaults must be conservative

---

## Kill-Switch Requirement

Each jurisdictional boundary MUST support:
- Deterministic disablement
- Immediate revocation
- Non-destructive rollback
- Audit log emission

Kill-switch activation MUST NOT:
- Corrupt identity state
- Invalidate historical proofs
- Modify past attestations

---

## Enforcement Layer

Jurisdictional logic MUST be enforced at:
- Identity Capsule boundary
- Proof issuance gate
- Runtime execution gate

UI-level enforcement alone is non-compliant.

---

## Invariant Statement

> Jurisdictional compliance is enforced by system design,
> not by operator discipline or user behavior.

Any system violating this invariant is non-compliant with Amethyst Canon.

