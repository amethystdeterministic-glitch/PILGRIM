# Biometric Attestation Invariant (Canonical)

## Status
Frozen · Canonical · Future-Ready

## Scope
Identity Capsule  
Deterministic Proof™  
Enterprise / Regulatory Environments

---

## Purpose

This invariant defines how biometric signals may be referenced within the Amethyst ecosystem **without mandating biometric collection, storage, or processing**.

It exists to:
- Establish deterministic, auditable framing
- Prevent implicit biometric coercion
- Enable future incorporation without redesign

No biometric data is required, stored, or processed in the current system.

---

## Definition

A **Biometric Attestation** is a cryptographic assertion that:

> “A biometric check of type **X** was performed under policy **Y** at time **T**, producing a deterministic result **R**.”

The system only records the **attestation**, never the biometric signal.

---

## Deterministic Constraints

- Biometric signals **never** enter Deterministic Proof™
- Only attestations may be referenced
- Attestations are optional and non-default
- No silent, implicit, or inferred biometric use

---

## Supported (Future) Modalities

The following modalities are explicitly supported for **future** incorporation:

- Facial recognition
- Fingerprint
- Retinal scan
- Iris scan
- Voiceprint
- Multimodal fusion

No modality is enabled by default.

---

## Identity Capsule Mapping

If enabled in the future, biometric attestations map to:

- **Identity Capsule → Attestation Layer**
- Never to Authentication Core
- Never to Storage Layer
- Never to Proof Payload

---

## Jurisdictional Controls

Biometric attestations are subject to jurisdictional kill-switches:

- **EU**: Disabled by default (GDPR / biometric sensitivity)
- **US**: Opt-in, explicit consent only
- **APAC**: Policy-defined, deployment-specific

Jurisdictional enforcement must be explicit and auditable.

---

## Invariant Statement

> Biometric identity is treated as a regulated attestation layer,  
> not an authentication shortcut.

Any system violating this invariant is non-compliant with Amethyst Canon.
