use std::collections::HashMap;

#[derive(Debug, Clone)]
pub struct IdentityToken {
    pub identity: String,
}

#[derive(Debug)]
pub enum GateResult {
    Authorized,
    Unauthorized,
}

pub struct IdentityGate {
    allowed: HashMap<String, bool>,
}

impl IdentityGate {
    pub fn new() -> Self {
        let mut allowed = HashMap::new();

        allowed.insert(
            "Amethyst Deterministic Ltd".to_string(),
            true,
        );

        Self { allowed }
    }

    pub fn verify(&self, token: &IdentityToken) -> GateResult {
        match self.allowed.get(&token.identity) {
            Some(true) => GateResult::Authorized,
            _ => GateResult::Unauthorized,
        }
    }
}
