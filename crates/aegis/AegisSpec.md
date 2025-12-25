# Aegis — Deterministic Receipt & Forensics Engine
Version: v0.1.0  
Status: FROZEN (Audit-Ready)  
Crate: `amethyst_aegis`  
Workspace: `amethyst_pilgrim_core`

---

## 1. Purpose

Aegis is a deterministic, tamper-evident receipt and forensic logging engine.

Its purpose is to:
- Seal decisions and actions into cryptographically verifiable receipts
- Detect post-hoc mutation or replay
- Provide a minimal forensic trail without surveillance
- Operate deterministically and offline

Aegis is **not** a policy engine, consensus layer, or identity provider.
It records *what happened*, not *why it was allowed*.

---

## 2. Scope (What Aegis Does)

Aegis provides:

- Deterministic receipt construction
- Cryptographic hashing (SHA-256)
- Envelope round-trip verification
- Forensic event emission
- Tamper detection
- Test-proven invariants

Out of scope by design:
- Network transport
- Persistence
- Consensus
- Authorization logic
- Time authority

---

## 3. Crate Location
amethyst_pilgrim_core/ └── crates/ └── aegis/ ├── src/ │   ├── lib.rs │   └── model.rs ├── tests/ │   └── contract_tests.rs └── Cargo.toml

---

## 4. Core Data Structures

### 4.1 AegisReceipt

Defined in `model.rs`.

Represents a sealed, immutable record.

Fields:
- `subject: Uuid`
- `decision: Decision`
- `checksum: [u8; 32]`

Notes:
- No setters
- No mutation
- Fields are public by design for verification
- Integrity is enforced via checksum

---

### 4.2 Decision

An enum representing the recorded outcome.

- Deterministic
- Serializable
- Comparable

No business logic is embedded.

---

### 4.3 ForensicEvent

Represents a forensic log entry.

Fields:
- `subject: Uuid`
- `decision: Decision`
- `timestamp: DateTime<Utc>`

Notes:
- Clone + Debug derived
- Currently emitted but not persisted
- Exists for downstream sinks

---

## 5. Receipt Construction

Receipt creation:
- Hash input fields deterministically
- Produce checksum
- Seal into `AegisReceipt`

No randomness.
No system clock dependency.

---

## 6. Verification Guarantees

Aegis guarantees:

- Receipt checksum mismatch == tamper detected
- Envelope round-trip preserves checksum
- Deterministic recomputation yields identical hash
- Any mutation breaks verification

---

## 7. Test Coverage

### 7.1 Contract Tests

Located in:
crates/aegis/tests/contract_tests.rs

Verified invariants:

- Request envelope round-trip verifies
- Response envelope round-trip verifies
- Checksum detects tampering

All tests passing.

---

### 7.2 Smoke Test

Located in `lib.rs`.

Verifies:
- Receipt creation
- Forensic event emission
- End-to-end integrity

---

## 8. Warnings (Known & Accepted)

Current compiler warnings are **intentional**:

- Unused imports (future extension hooks)
- Forensic fields not yet consumed
- Record function reserved for sinks

These do NOT affect correctness or security.

---

## 9. Freeze Conditions

Aegis is considered **complete and frozen** when:

- All tests pass
- No behavior changes without spec revision
- Any extension requires version bump

Current state satisfies all freeze conditions.

---

## 10. Integration Contracts

Downstream systems may:
- Consume receipts
- Verify checksums
- Persist forensic events
- Transport envelopes

They may NOT:
- Mutate receipts
- Recompute checksums with altered inputs
- Assume wall-clock authority

---

## 11. Security Posture

- Offline-safe
- Deterministic
- Non-surveillant
- Tamper-evident
- Audit-friendly

Aegis assumes a hostile environment.

---

## 12. Status

**Aegis v0.1.0 is COMPLETE.**

No further coding required.
Only documentation, audits, and integration remain.
