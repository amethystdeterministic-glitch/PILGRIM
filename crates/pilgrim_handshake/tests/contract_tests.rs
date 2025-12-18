use pilgrim_handshake::*;

#[test]
fn request_envelope_roundtrip_verifies() {
    let intent = Intent {
        intent_id: "intent-0001".to_string(),
        created_unix_ms: 1700000000000,
        operator: Some("Amethyst Cymru".to_string()),
        statement: "Prove determinism of envelope checksum.".to_string(),
        inputs: vec![
            Datum { key: "alpha".to_string(), value: "1".to_string() },
            Datum { key: "beta".to_string(), value: "2".to_string() },
        ],
        constraints: Constraints::default(),
        nonce: 7,
    };

    let env = RequestEnvelope::new(intent);
    env.verify().unwrap();
}

#[test]
fn response_envelope_roundtrip_verifies() {
    let resp = ResponseEnvelope::new(
        "intent-0001".to_string(),
        RunStatus::Accepted,
        "Accepted by deterministic core.".to_string(),
    );
    resp.verify().unwrap();
}

#[test]
fn checksum_detects_tamper() {
    let intent = Intent {
        intent_id: "intent-0002".to_string(),
        created_unix_ms: 1700000000000,
        operator: None,
        statement: "Original".to_string(),
        inputs: vec![],
        constraints: Constraints::default(),
        nonce: 1,
    };

    let mut env = RequestEnvelope::new(intent);
    env.verify().unwrap();

    // Tamper after creation
    env.intent.statement = "Tampered".to_string();
    assert!(env.verify().is_err());
}
