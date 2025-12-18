use crate::store::PrivacyTier;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Constraints {
    pub max_steps: Option<u64>,
    pub max_runtime_ms: Option<u64>,
    pub require_logs: bool,
    pub privacy: PrivacyTier,
}

impl Default for Constraints {
    fn default() -> Self {
        Self {
            max_steps: None,
            max_runtime_ms: None,
            require_logs: false,
            privacy: PrivacyTier::Public,
        }
    }
}

impl Constraints {
    /// Strict enforcement hook for deterministic execution.
    pub fn assert_step_allowed(&self, next_step_index: u64) -> Result<(), ConstraintsError> {
        if let Some(max) = self.max_steps {
            if next_step_index >= max {
                return Err(ConstraintsError::StepLimitExceeded {
                    max_steps: max,
                    attempted_step_index: next_step_index,
                });
            }
        }
        Ok(())
    }

    pub fn assert_runtime_allowed(&self, elapsed_ms: u64) -> Result<(), ConstraintsError> {
        if let Some(max) = self.max_runtime_ms {
            if elapsed_ms > max {
                return Err(ConstraintsError::RuntimeLimitExceeded {
                    max_runtime_ms: max,
                    elapsed_ms,
                });
            }
        }
        Ok(())
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum ConstraintsError {
    StepLimitExceeded {
        max_steps: u64,
        attempted_step_index: u64,
    },
    RuntimeLimitExceeded {
        max_runtime_ms: u64,
        elapsed_ms: u64,
    },
}
