use pilgrim_core::{PilgrimEngine, Constraints};

#[test]
fn step_limit_blocks_execution() {
    let mut c = Constraints::default();
    c.max_steps = Some(2);

    let engine = PilgrimEngine::new(c);

    let result = engine.run("run-steps", "intent", b"abc", 0);
    assert!(result.is_err());
}

#[test]
fn runtime_limit_blocks_execution() {
    let mut c = Constraints::default();
    c.max_runtime_ms = Some(10);

    let engine = PilgrimEngine::new(c);

    let result = engine.run("run-rt", "intent", b"abc", 11);
    assert!(result.is_err());
}

#[test]
fn constraints_preserve_determinism() {
    let mut c = Constraints::default();
    c.max_steps = Some(10);
    c.max_runtime_ms = Some(100);

    let engine = PilgrimEngine::new(c);

    let r1 = engine.run("run-1", "intent", b"hello", 5).unwrap();
    let r2 = engine.run("run-1", "intent", b"hello", 5).unwrap();

    assert_eq!(r1.final_trace_hash, r2.final_trace_hash);
}
