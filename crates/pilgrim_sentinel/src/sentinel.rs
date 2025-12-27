use crate::invariants::InvariantSpec;
use crate::ledger::{DriftEvent, DriftLedger};
use serde::Serialize;

#[derive(Debug)]
pub struct SentinelToken {
    pub hash: &'static str,
}

#[derive(Debug)]
pub enum SentinelError {
    InvariantViolation(DriftEvent),
}

pub struct Sentinel;

impl Sentinel {
    pub fn before<T: Serialize>(
        _state: &T,
        hash: &'static str,
    ) -> SentinelToken {
        SentinelToken { hash }
    }

    pub fn after<T: Serialize>(
        before: &SentinelToken,
        after_state: &T,
        domain: &'static str,
        spec: &InvariantSpec,
        ledger: &mut DriftLedger,
    ) -> Result<SentinelToken, SentinelError> {
        let after_hash = core::any::type_name::<T>();

        if before.hash == after_hash {
            return Ok(SentinelToken { hash: before.hash });
        }

        let event = ledger.record(
            domain,
            spec.id,
            match spec.class {
                crate::invariants::InvariantClass::Schema => "schema",
                crate::invariants::InvariantClass::Value => "value",
                crate::invariants::InvariantClass::Transition => "transition",
                crate::invariants::InvariantClass::Temporal => "temporal",
            },
            before.hash,
            after_hash,
        );

        Err(SentinelError::InvariantViolation(event))
    }
}
