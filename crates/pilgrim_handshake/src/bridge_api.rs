use crate::*;

/// Bridge-facing helpers for Pilgrim Handshake.
/// This layer must never assume internal-only types.

impl Constraints {
    /// Deterministic constructor for bridge callers.
    pub fn from_json_string(_s: &str) -> Self {
        Constraints {
            max_steps: 0,
            max_runtime_ms: 0,
            require_logs: false,
            ..Default::default()
        }
    }
}

impl RequestEnvelope {
    /// Canonical bytes used for sealing and verification.
    /// Must be stable across platforms.
    pub fn seal_bytes(&self) -> Vec<u8> {
        serde_json::to_vec(&(self.protocol.clone(), &self.intent))
            .expect("serialization cannot fail")
    }

    /// Alias for bridge / FFI consumers.
    pub fn to_canonical_bytes(&self) -> Vec<u8> {
        self.seal_bytes()
    }
}
