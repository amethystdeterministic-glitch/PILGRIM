use pilgrim_core::identity::gate::{identity_gate, GateResult};

#[test]
fn blocks_when_signature_invalid() {
    let public_key = [0u8; 32];
    let signature = [0u8; 64];
    let seed = [1u8; 32];

    let result = identity_gate(
        &public_key,
        b"persona_a",
        &signature,
        &seed,
        "PersonaA",
    );

    assert!(matches!(result, GateResult::Unauthorized));
}
