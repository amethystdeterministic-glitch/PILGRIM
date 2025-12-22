use chrono::{DateTime, Utc};
use uuid::Uuid;

mod model;
mod policy;

use model::{AegisReceipt, Decision, ForensicEvent};
use policy::PolicyEngine;

/// AEGIS ENTRYPOINT
pub fn evaluate(subject: Uuid) -> Option<AegisReceipt> {
    let decision = PolicyEngine::decide(subject);
    let issued_at = Utc::now();

    let receipt = AegisReceipt::new(
        subject,
        decision.clone(),
        issued_at,
    );

    // Immutable forensic record (write-only concept)
    let _event = ForensicEvent {
        subject,
        decision,
        timestamp: issued_at,
    };

    Some(receipt)
}

#[cfg(test)]
mod smoke {
    use super::*;
    use uuid::Uuid;

    #[test]
    fn aegis_receipt_and_forensics_smoke() {
        let subject = Uuid::new_v4();
        let decision = Decision::Allow(vec!["core".into()]);
        let issued_at = Utc::now();

        let receipt = AegisReceipt::new(
            subject,
            decision.clone(),
            issued_at,
        );

        // IMPORTANT: field access, NOT method calls
        assert_eq!(receipt.subject, subject);
        assert_eq!(receipt.decision, decision);
        assert_eq!(receipt.issued_at, issued_at);

        let event = ForensicEvent {
            subject,
            decision,
            timestamp: issued_at,
        };

        assert_eq!(event.subject, subject);
    }
}
