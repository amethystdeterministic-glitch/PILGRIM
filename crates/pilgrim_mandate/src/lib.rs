use pilgrim_identity::Identity;

/// A single authorization rule
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct MandateRule {
    pub subject_id: String,
    pub cartridge_id: String,
}

/// Mandate engine
///
/// Mandate is intentionally simple:
/// it expresses *who may execute what*.
/// No crypto. No state. No execution.
#[derive(Debug, Clone)]
pub struct Mandate {
    rules: Vec<MandateRule>,
}

impl Mandate {
    /// Create a new mandate with explicit rules
    pub fn new(rules: Vec<MandateRule>) -> Self {
        Self { rules }
    }

    /// Check if an identity is allowed to execute a cartridge
    pub fn allows(&self, identity: &Identity, cartridge_id: &str) -> bool {
        self.rules.iter().any(|r| {
            r.subject_id == identity.subject_id &&
            r.cartridge_id == cartridge_id
        })
    }

    /// Enforce mandate (fail-fast)
    pub fn enforce(
        &self,
        identity: &Identity,
        cartridge_id: &str,
    ) -> Result<(), MandateError> {
        if self.allows(identity, cartridge_id) {
            Ok(())
        } else {
            Err(MandateError::Denied {
                subject_id: identity.subject_id.clone(),
                cartridge_id: cartridge_id.to_string(),
            })
        }
    }
}

/// Mandate enforcement errors
#[derive(Debug, Clone)]
pub enum MandateError {
    Denied {
        subject_id: String,
        cartridge_id: String,
    },
}

impl std::fmt::Display for MandateError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            MandateError::Denied {
                subject_id,
                cartridge_id,
            } => write!(
                f,
                "MANDATE VIOLATION: identity '{}' is not allowed to execute cartridge '{}'",
                subject_id, cartridge_id
            ),
        }
    }
}

impl std::error::Error for MandateError {}

#[cfg(test)]
mod tests {
    use super::*;
    use pilgrim_identity::Identity;

    fn demo_identity() -> Identity {
        Identity::new("ernesto_lopez", b"demo-pubkey-bytes").unwrap()
    }

    #[test]
    fn allows_authorized_identity() {
        let identity = demo_identity();

        let mandate = Mandate::new(vec![
            MandateRule {
                subject_id: "ernesto_lopez".to_string(),
                cartridge_id: "cognitive_drift_v1".to_string(),
            }
        ]);

        assert!(mandate.allows(&identity, "cognitive_drift_v1"));
        assert!(mandate.enforce(&identity, "cognitive_drift_v1").is_ok());
    }

    #[test]
    fn blocks_unauthorized_identity() {
        let identity = demo_identity();

        let mandate = Mandate::new(vec![]);

        let err = mandate
            .enforce(&identity, "cognitive_drift_v1")
            .unwrap_err();

        assert!(matches!(err, MandateError::Denied { .. }));
    }

    #[test]
    fn different_cartridge_is_denied() {
        let identity = demo_identity();

        let mandate = Mandate::new(vec![
            MandateRule {
                subject_id: "ernesto_lopez".to_string(),
                cartridge_id: "threshold_lock_v1".to_string(),
            }
        ]);

        assert!(!mandate.allows(&identity, "cognitive_drift_v1"));
    }
}
