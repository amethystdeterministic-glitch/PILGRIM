use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone)]
pub enum Decision {
    Allow(Vec<String>),
    Deny(String),
}

#[derive(Debug, Clone)]
pub struct AegisReceipt {
    pub subject: Uuid,
    pub decision: Decision,
    pub issued_at: DateTime<Utc>,
}

impl AegisReceipt {
    pub fn new(subject: Uuid, decision: Decision, issued_at: DateTime<Utc>) -> Self {
        Self {
            subject,
            decision,
            issued_at,
        }
    }

    // Optional getters (prevents `subject()` mistakes later)
    pub fn subject(&self) -> Uuid {
        self.subject
    }
    pub fn decision(&self) -> &Decision {
        &self.decision
    }
    pub fn issued_at(&self) -> DateTime<Utc> {
        self.issued_at
    }
}

#[derive(Debug, Clone)]
pub struct ForensicEvent {
    pub subject: Uuid,
    pub decision: Decision,
    pub timestamp: DateTime<Utc>,
}

impl ForensicEvent {
    pub fn record(subject: Uuid, decision: Decision, timestamp: DateTime<Utc>) -> Self {
        Self {
            subject,
            decision,
            timestamp,
        }
    }
}
