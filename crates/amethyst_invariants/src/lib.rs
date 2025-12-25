//! Amethyst Invariants
//!
//! This crate defines non-negotiable system invariants.
//! Invariants are compile-time truths that must hold across
//! all layers of Amethyst: Pilgrim, cOS, and T.
//!
//! No inference. No tracking. No adaptation.
//! Truth in → truth out.

#![no_std]

/// Core invariant categories.
/// These exist to constrain system design,
/// not to control behaviour.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InvariantCategory {
    Truth,
    Determinism,
    Agency,
    Transparency,
    Safety,
}

/// A system invariant.
///
/// Invariants MUST be:
/// - Globally true
/// - Non-contextual
/// - Non-adaptive
/// - Enforced by design, not policy
#[derive(Debug)]
pub struct Invariant {
    pub id: &'static str,
    pub category: InvariantCategory,
    pub description: &'static str,
}

/// SYSTEM INVARIANTS
///
/// These invariants define what Amethyst
/// is allowed to be — and what it is not.
pub const SYSTEM_INVARIANTS: &[Invariant] = &[
    // ─────────────────────────────────────────────
    // TRUTH
    // ─────────────────────────────────────────────
    Invariant {
        id: "TRUTH_001",
        category: InvariantCategory::Truth,
        description: "All outputs must be derivable from explicit inputs and declared logic.",
    },
    Invariant {
        id: "TRUTH_002",
        category: InvariantCategory::Truth,
        description: "No hidden assumptions, priors, or inferred intent may influence output.",
    },

    // ─────────────────────────────────────────────
    // DETERMINISM
    // ─────────────────────────────────────────────
    Invariant {
        id: "DET_001",
        category: InvariantCategory::Determinism,
        description: "Identical inputs under identical state must produce identical outputs.",
    },
    Invariant {
        id: "DET_002",
        category: InvariantCategory::Determinism,
        description: "System behaviour must not vary based on user identity, emotion, or inferred state.",
    },

    // ─────────────────────────────────────────────
    // AGENCY
    // ─────────────────────────────────────────────
    Invariant {
        id: "AGENCY_001",
        category: InvariantCategory::Agency,
        description: "The system must never persuade, coerce, or nudge a user toward an outcome.",
    },
    Invariant {
        id: "AGENCY_002",
        category: InvariantCategory::Agency,
        description: "All decisions remain with the user; the system provides information only.",
    },

    // ─────────────────────────────────────────────
    // TRANSPARENCY
    // ─────────────────────────────────────────────
    Invariant {
        id: "TRANS_001",
        category: InvariantCategory::Transparency,
        description: "All system outputs must be explainable and auditable.",
    },
    Invariant {
        id: "TRANS_002",
        category: InvariantCategory::Transparency,
        description: "No internal state may affect output without being inspectable by design.",
    },

    // ─────────────────────────────────────────────
    // SAFETY
    // ─────────────────────────────────────────────
    Invariant {
        id: "SAFE_001",
        category: InvariantCategory::Safety,
        description: "The system must fail closed rather than speculate or hallucinate.",
    },
    Invariant {
        id: "SAFE_002",
        category: InvariantCategory::Safety,
        description: "Absence of data must result in explicit uncertainty, not inferred completion.",
    },
];

/// Compile-time invariant count.
/// Useful for audits and integrity checks.
pub const INVARIANT_COUNT: usize = SYSTEM_INVARIANTS.len();
