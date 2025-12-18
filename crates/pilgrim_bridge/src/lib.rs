use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum BridgeError {
    #[error("Input was empty")]
    EmptyInput,

    #[error("Invalid JSON: {0}")]
    Json(String),

    #[error("Handshake verification failed: {0}")]
    Handshake(String),

    #[error("Internal error: {0}")]
    Internal(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WireIntent {
    pub intent_id: String,
    pub created_unix_ms: i64,
    pub operator: Option<String>,
    pub statement: String,
    pub inputs: Vec<serde_json::Value>,
    pub constraints: serde_json::Value,
    pub nonce: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WireRequest {
    pub intent: WireIntent,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct WireReceipt {
    pub ok: bool,
    pub intent_id: String,
    pub envelope_sha256: String,
    pub receipt_sha256: String,
    pub message: String,
}

fn sha256_hex(bytes: &[u8]) -> String {
    let mut h = Sha256::new();
    h.update(bytes);
    hex::encode(h.finalize())
}

/// Core bridge: JSON(request) -> JSON(receipt)
///
/// Determinism rule:
/// - Receipt is derived only from the verified envelope bytes (stable) + intent_id.
/// - No wall-clock calls.
/// - No random.
/// - Same input -> same output.
pub fn bridge_json(input: &str) -> Result<String, BridgeError> {
    let trimmed = input.trim();
    if trimmed.is_empty() {
        return Err(BridgeError::EmptyInput);
    }

    let req: WireRequest = serde_json::from_str(trimmed)
        .map_err(|e| BridgeError::Json(e.to_string()))?;

    // --- Build the canonical intent expected by pilgrim_handshake ---
    // NOTE: constraints is carried as JSON; we pass it through as a string
    // to keep this bridge independent of your internal constraint schema.
    // You can tighten this later (typed constraints).
    let constraints_str = serde_json::to_string(&req.intent.constraints)
        .map_err(|e| BridgeError::Internal(e.to_string()))?;

    // These types/functions must exist in your pilgrim_handshake crate.
    // If your field names differ, we’ll adapt next.
    let intent = pilgrim_handshake::Intent {
        intent_id: req.intent.intent_id.clone(),
        created_unix_ms: req.intent.created_unix_ms,
        operator: req.intent.operator.clone(),
        statement: req.intent.statement.clone(),
        inputs: req.intent.inputs.clone(),
        constraints: pilgrim_handshake::Constraints::from_json_string(&constraints_str),
        nonce: req.intent.nonce,
    };

    let env = pilgrim_handshake::RequestEnvelope::new(intent);

    // Verify cryptographic sealing / tamper detection
    env.verify().map_err(|e| BridgeError::Handshake(format!("{:?}", e)))?;

    // Stable bytes for deterministic hashing (must be provided by handshake crate)
    let envelope_bytes = env.to_canonical_bytes();

    let envelope_sha = sha256_hex(&envelope_bytes);

    // Receipt is derived deterministically from envelope hash + intent_id
    let receipt_material = format!("pilgrim_receipt_v0:{}:{}", req.intent.intent_id, envelope_sha);
    let receipt_sha = sha256_hex(receipt_material.as_bytes());

    let receipt = WireReceipt {
        ok: true,
        intent_id: req.intent.intent_id,
        envelope_sha256: envelope_sha,
        receipt_sha256: receipt_sha,
        message: "Handshake verified. Deterministic receipt issued.".to_string(),
    };

    serde_json::to_string_pretty(&receipt)
        .map_err(|e| BridgeError::Internal(e.to_string()))
}
