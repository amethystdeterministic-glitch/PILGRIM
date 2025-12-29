//! Core contract definitions for Pilgrim
//!
//! A contract is a *semantic agreement* between
//! identity, mandate, and execution layers.

use serde::{Deserialize, Serialize};

/// Canonical contract verdict
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum ContractVerdict {
    Allow,
    Deny,
    Review,
}

/// A contract decision produced by core reasoning
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Contract {
    pub subject_id: String,
    pub cartridge_id: String,
    pub verdict: ContractVerdict,
    pub reason: String,
}

impl Contract {
    pub fn allow(subject_id: impl Into<String>, cartridge_id: impl Into<String>) -> Self {
        Self {
            subject_id: subject_id.into(),
            cartridge_id: cartridge_id.into(),
            verdict: ContractVerdict::Allow,
            reason: "Contract satisfied".into(),
        }
    }

    pub fn deny(
        subject_id: impl Into<String>,
        cartridge_id: impl Into<String>,
        reason: impl Into<String>,
    ) -> Self {
        Self {
            subject_id: subject_id.into(),
            cartridge_id: cartridge_id.into(),
            verdict: ContractVerdict::Deny,
            reason: reason.into(),
        }
    }

    pub fn review(
        subject_id: impl Into<String>,
        cartridge_id: impl Into<String>,
        reason: impl Into<String>,
    ) -> Self {
        Self {
            subject_id: subject_id.into(),
            cartridge_id: cartridge_id.into(),
            verdict: ContractVerdict::Review,
            reason: reason.into(),
        }
    }
}
