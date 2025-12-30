use pilgrim_sentinel::{Sentinel, InvariantSpec, InvariantClass, DriftLedger};
use serde::Serialize;

#[derive(Serialize)]
struct State {
    value: u32,
}

fn main() {
    println!("DRE demo starting");

    let mut state = State { value: 1 };

    // BEFORE execution snapshot
    let token = Sentinel::before(&state, "STATE_V1");

    // ⚠️ SILENT MUTATION (simulated attack)
    state.value = 999;

    println!("State mutated silently – enforcement should trigger");

    // AFTER execution — MUST HALT (fail closed)
    Sentinel::after(
        &token,
        &state,
        "demo",
        &dummy_spec(),
        &mut dummy_ledger(),
    );

    // ❌ MUST NEVER RUN
    println!("❌ ERROR: runtime continued past enforcement");
}

// ---- Minimal stubs ----

fn dummy_spec() -> InvariantSpec {
    InvariantSpec {
        id: "demo-invariant",
        class: InvariantClass::Value,
    }
}

fn dummy_ledger() -> DriftLedger {
    DriftLedger::new()
}
