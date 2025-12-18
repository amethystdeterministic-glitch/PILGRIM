use pilgrim_core::{PilgrimEngine, Constraints};

#[test]
fn deterministic_receipts_match_on_repeat_runs() {
    let constraints = Constraints::default();
    let engine = PilgrimEngine::new(constraints);

    let r1 = engine
        .run("run-001", "determinism-test", b"hello", 5)
        .unwrap();

    let r2 = engine
        .run("run-001", "determinism-test", b"hello", 5)
        .unwrap();

    assert_eq!(r1.final_trace_hash, r2.final_trace_hash);
    assert_eq!(r1.steps, r2.steps);
    assert_eq!(r1.receipt.final_trace_hash, r2.receipt.final_trace_hash);
}
