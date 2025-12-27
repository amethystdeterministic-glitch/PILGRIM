use pilgrim_sentinel::{
    Sentinel,
    SentinelError,
};

use pilgrim_sentinel::ledger::DriftLedger;
use pilgrim_sentinel::invariants::{
    InvariantRegistry,
    InvariantSpec,
    InvariantClass,
};

#[derive(serde::Serialize)]
struct State {
    value: u32,
}

#[test]
fn sentinel_detects_transition_drift() {
    // --- registry ---
    let mut registry = InvariantRegistry::new();
    registry.register(
        InvariantSpec::new(
            "test::drift",
            InvariantClass::Transition,
        )
    );

    // --- ledger ---
    let mut ledger = DriftLedger::new();

    // --- states ---
    let s1 = State { value: 1 };
    let s2 = State { value: 1 }; // identical => drift

    // --- before snapshot ---
    let before = Sentinel::before(&s1, "test::drift");

    // --- enforce ---
    let spec = registry
        .get("test::drift")
        .expect("
