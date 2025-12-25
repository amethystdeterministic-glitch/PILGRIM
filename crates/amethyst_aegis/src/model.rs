use chrono::{DateTime, Utc};
use uuid::Uuid;

/// Deterministic decision record
#[derive(Clone, Debug, PartialEq)]
pub enum Decision {
    Allow,
    Deny,
    Review,
}

/// Immutable forensic event
#[derive(Clone, Debug)]
pub struct ForensicEvent {
    pub subject: Uuid,
    pub decision: Decision,
    pub timestamp: DateTime<Utc>,
}

impl ForensicEvent {
    pub fn record(subject: Uuid, decision: Decision) -> Self {
        Self {
            subject,
            decision,
            timestamp: Utc::now(),
        }
    }
}
