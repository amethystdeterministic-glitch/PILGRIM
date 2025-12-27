use pilgrim_sentinel::ledger::DriftLedger;

#[test]
fn drift_ledger_chains_events_deterministically() {
    let mut ledger = DriftLedger::new();

    let e1 = ledger.record(
        "inv-001",
        "schema",
        "state",
        "stage-A",
        "hash-A",
    );

    // Explicitly end the first borrow by extracting what we need
    let e1_hash = e1.after_hash.clone();

    let e2 = ledger.record(
        "inv-002",
        "value",
        "state",
        "stage-B",
        "hash-B",
    );

assert_eq!(e2.prev_event_hash.as_deref(), Some(&e1_hash));
}
