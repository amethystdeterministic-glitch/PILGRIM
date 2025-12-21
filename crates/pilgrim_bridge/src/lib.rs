use pilgrim_handshake::{Intent, RequestEnvelope};

use base64::{engine::general_purpose::STANDARD as B64, Engine as _};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifyRequest {
    pub intent: Intent,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VerifyResponse {
    pub ok: bool,
    pub checksum_sha256_hex: String,
    pub sealed_bytes_b64: String,
    pub error: Option<String>,
}

/// Deterministic seal + verify.
/// - builds a RequestEnvelope
/// - verifies integrity
/// - returns a sha256 over the canonical/sealed bytes
pub fn verify_intent(req: VerifyRequest) -> VerifyResponse {
    let env = RequestEnvelope::new(req.intent);

    // If your handshake crate implements verify(), we use it.
    // If verify() fails, we return error with ok=false.
    if let Err(e) = env.verify() {
        return VerifyResponse {
            ok: false,
            checksum_sha256_hex: "".to_string(),
            sealed_bytes_b64: "".to_string(),
            error: Some(format!("{e:?}")),
        };
    }

    // We rely on a deterministic byte representation.
    // Your current build already introduced `seal_bytes()` in bridge_api.rs.
    let sealed = env.seal_bytes();

    let mut hasher = Sha256::new();
    hasher.update(&sealed);
    let checksum = hasher.finalize();
    let checksum_hex = hex::encode(checksum);

    VerifyResponse {
        ok: true,
        checksum_sha256_hex: checksum_hex,
        sealed_bytes_b64: B64.encode(sealed),
        error: None,
    }
}
