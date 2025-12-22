use uuid::Uuid;

use crate::model::Decision;

pub struct PolicyEngine;

impl PolicyEngine {
    pub fn decide(_subject: Uuid) -> Decision {
        // Deterministic placeholder policy
        Decision::Allow(vec!["core".into()])
    }

    // Reserved for cryptographic signing / attestations
    #[allow(dead_code)]
    pub fn sign(_decision: &Decision) {
        // intentionally empty (future hook)
    }
}
