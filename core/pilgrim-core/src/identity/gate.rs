#[derive(Debug, Clone, PartialEq, Eq)]
pub enum GateResult {
    Allow,
    Unauthorized,
}

pub fn identity_gate(
    _public_key: &[u8; 32],
    _message: &[u8],
    _signature: &[u8; 64],
    _seed: &[u8; 32],
    _persona: &str,
) -> GateResult {
    // T13 invariant:
    // Until cryptographic verification is implemented,
    // the gate MUST fail closed.
    GateResult::Unauthorized
}
