use pilgrim_handshake::Intent;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

pub const ENGINE_VERSION: &str = "pilgrim_core/engine_v0";

#[derive(Debug, thiserror::Error)]
pub enum CoreError {
    #[error("receipt verification failed: {0}")]
    VerificationFailed(String),
    #[error("serialization failed: {0}")]
    Serialization(String),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Step {
    pub idx: u32,
    pub label: String,
    pub digest_hex: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExecutionTrace {
    pub engine_version: String,
    pub intent_digest_hex: String,
    pub steps: Vec<Step>,
    pub trace_hash_hex: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Output {
    pub status: String,
    pub result_token: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Receipt {
    pub engine_version: String,
    pub intent_id: String,
    pub created_unix_ms: u64,
    pub output: Output,
    pub trace: ExecutionTrace,
}

#[derive(Debug, Default)]
pub struct DeterministicEngine;

impl DeterministicEngine {
    pub fn execute(&self, intent: &Intent) -> Result<Receipt, CoreError> {
        // 1) Canonicalize intent -> digest
        let intent_bytes = canonical_json_bytes(intent)?;
        let intent_digest = sha256_hex(&intent_bytes);

        // 2) Deterministic output: derived ONLY from intent digest (no hidden state)
        let output = Output {
            status: "idle".to_string(),
            result_token: format!("PILGRIM::{}", intent_digest),
        };

        // 3) Build trace steps (auditable)
        let mut steps: Vec<Step> = Vec::new();
        steps.push(Step {
            idx: 0,
            label: "intent_canonicalized".to_string(),
            digest_hex: intent_digest.clone(),
        });

        let output_bytes = canonical_json_bytes(&output)?;
        steps.push(Step {
            idx: 1,
            label: "output_derived".to_string(),
            digest_hex: sha256_hex(&output_bytes),
        });

        // 4) Trace hash covers (engine_version + intent_digest + steps)
        let mut trace = ExecutionTrace {
            engine_version: ENGINE_VERSION.to_string(),
            intent_digest_hex: intent_digest.clone(),
            steps,
            trace_hash_hex: String::new(),
        };

        let trace_hash = sha256_hex(&canonical_json_bytes(&trace)?);
        trace.trace_hash_hex = trace_hash;

        Ok(Receipt {
            engine_version: ENGINE_VERSION.to_string(),
            intent_id: intent.intent_id.clone(),
            created_unix_ms: intent.created_unix_ms,
            output,
            trace,
        })
    }

    /// Recomputes the trace hash and ensures the receipt is untampered.
    pub fn verify_receipt(&self, receipt: &Receipt, intent: &Intent) -> Result<(), CoreError> {
        // Intent digest must match
        let intent_digest = sha256_hex(&canonical_json_bytes(intent)?);
        if intent_digest != receipt.trace.intent_digest_hex {
            return Err(CoreError::VerificationFailed(
                "intent digest mismatch".to_string(),
            ));
        }

        // Recompute trace hash from the trace content (with trace_hash_hex blanked)
        let mut trace_rebuild = receipt.trace.clone();
        trace_rebuild.trace_hash_hex = String::new();
        let rebuilt_hash = sha256_hex(&canonical_json_bytes(&trace_rebuild)?);

        if rebuilt_hash != receipt.trace.trace_hash_hex {
            return Err(CoreError::VerificationFailed(
                "trace hash mismatch (tamper detected)".to_string(),
            ));
        }

        // Output must still match what engine would derive from the same intent
        let expected = self.execute(intent)?;
        if expected.output.result_token != receipt.output.result_token
            || expected.output.status != receipt.output.status
        {
            return Err(CoreError::VerificationFailed(
                "output mismatch (tamper or non-determinism)".to_string(),
            ));
        }

        Ok(())
    }
}

fn canonical_json_bytes<T: Serialize>(value: &T) -> Result<Vec<u8>, CoreError> {
    serde_json::to_vec(value).map_err(|e| CoreError::Serialization(e.to_string()))
}

fn sha256_hex(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    let out = hasher.finalize();
    hex::encode(out)
}
