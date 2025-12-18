use pilgrim_core::DeterministicEngine;
use pilgrim_handshake::{Constraints, Intent};

fn mk_intent(statement: &str) -> Intent {
    Intent {
        intent_id: "intent-ENGINE-0001".to_string(),
        created_unix_ms: 1700000000000,
        operator: None,
        statement: statement.to_string(),
        inputs: vec![],
        constraints: Constraints::default(),
        nonce: 1,
    }
}

#[test]
fn deterministic_same_intent_same_receipt_hash() {
    let engine = DeterministicEngine::default();
    let intent = mk_intent("Boot Pilgrim");

    let r1 = engine.execute(&intent).unwrap();
    let r2 = engine.execute(&intent).unwrap();

    assert_eq!(r1.trace.intent_digest_hex, r2.trace.intent_digest_hex);
    assert_eq!(r1.trace.trace_hash_hex, r2.trace.trace_hash_hex);
    assert_eq!(r1.output.result_token, r2.output.result_token);
}

#[test]
fn tamper_detected_when_output_changes() {
    let engine = DeterministicEngine::default();
    let intent = mk_intent("Boot Pilgrim");

    let mut receipt = engine.execute(&intent).unwrap();
    engine.verify_receipt(&receipt, &intent).unwrap();

    // Tamper after creation
    receipt.output.status = "active".to_string();

    assert!(engine.verify_receipt(&receipt, &intent).is_err());
}

#[test]
fn intent_mutation_changes_digest() {
    let engine = DeterministicEngine::default();
    let intent_a = mk_intent("Boot Pilgrim");
    let intent_b = mk_intent("Boot Pilgrim NOW");

    let a = engine.execute(&intent_a).unwrap();
    let b = engine.execute(&intent_b).unwrap();

    assert_ne!(a.trace.intent_digest_hex, b.trace.intent_digest_hex);
}
