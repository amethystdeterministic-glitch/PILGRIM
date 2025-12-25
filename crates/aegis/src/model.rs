use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Decision {
    Approve,
    Reject,
    Escalate,
}

#[derive(Debug, Clone)]
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
