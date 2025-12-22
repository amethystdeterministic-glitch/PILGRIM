// crates/aegis/src/receipts.rs

use std::collections::HashMap;

use uuid::Uuid;
use chrono::{DateTime, Utc};

use crate::model::AegisReceipt;

/// Minimal in-memory receipt store.
/// This is intentionally simple: deterministic, testable, no I/O.
#[derive(Debug, Default)]
pub struct ReceiptStore {
    by_subject: HashMap<Uuid, Vec<AegisReceipt>>,
}

impl ReceiptStore {
    pub fn new() -> Self {
        Self { by_subject: HashMap::new() }
    }

    /// Insert a receipt under its subject.
    pub fn insert(&mut self, receipt: AegisReceipt) {
        self.by_subject.entry(receipt.subject).or_default().push(receipt);
    }

    /// Get all receipts for a subject.
    pub fn list(&self, subject: Uuid) -> Vec<AegisReceipt> {
        self.by_subject.get(&subject).cloned().unwrap_or_default()
    }

    /// Get the latest receipt for a subject (by issued_at).
    pub fn latest(&self, subject: Uuid) -> Option<AegisReceipt> {
        self.by_subject
            .get(&subject)
            .and_then(|v| v.iter().cloned().max_by_key(|r| r.issued_at))
    }
}

/// A small helper to build a receipt with "now" if you want it.
/// (Useful in demos/tests; keeps call sites clean.)
pub fn new_receipt_now(subject: Uuid, decision: crate::model::Decision) -> AegisReceipt {
    AegisReceipt::new(subject, decision, Utc::now())
}

/// Small convenience: check if a receipt is
