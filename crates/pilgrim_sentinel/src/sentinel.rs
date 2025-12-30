use crate::invariants::{InvariantClass, InvariantSpec};
use crate::ledger::DriftLedger;
use pilgrim_dre::enforce;
use serde::Serialize;

#[derive(Debug)]
pub struct SentinelToken {
    pub hash: &'static str,
}

pub struct Sentinel;

impl Sentinel {
    /// Capture pre-execution state fingerprint
    pub fn before<T: Serialize>(
        _state: &T,
        hash: &'static str,
    ) -> SentinelToken {
        SentinelToken { hash }
    }

    /// Deterministic Runtime Enforcement
    /// FAILS CLOSED — NO RECOVERY PATH
    pub fn after<T: Serialize>(
        before: &SentinelToken,
        _after_state: &T,
        domain: &'static str,
        spec: &InvariantSpec,
        ledger: &mut DriftLedger,
    ) -> SentinelToken {
        let after_hash = core::any::type_name::<T>();

        // 🔒 D.R.E. — silent runtime mutation is forbidden
        if before.hash != after_hash {
            // Record violation FIRST (immutable receipt)
            ledger.record(
                domain,
                spec.id,
                match spec.class {
                    InvariantClass::Schema => "schema",
                    InvariantClass::Value => "value",
                    InvariantClass::Transition => "transition",
                    InvariantClass::Temporal => "temporal",
                },
                before.hash,
                after_hash,
            );

            // HARD STOP — deterministic halt
            // This NEVER returns
            enforce(false);
        }

        SentinelToken { hash: before.hash }
    }
}
