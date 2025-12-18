use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct TraceEvent {
    pub step_index: u64,
    pub step_name: String,
    pub input_hash: String,
    pub output_hash: String,
    pub prev_trace_hash: String,
}

pub fn hash_bytes(bytes: &[u8]) -> String {
    let mut h = Sha256::new();
    h.update(bytes);
    hex::encode(h.finalize())
}

pub fn hash_json<T: Serialize>(value: &T) -> String {
    let bytes = serde_json::to_vec(value).expect("json serialize cannot fail");
    hash_bytes(&bytes)
}

pub fn fold_trace(prev: &str, event: &TraceEvent) -> String {
    // deterministic: hash(prev || canonical_event_json)
    let mut h = Sha256::new();
    h.update(prev.as_bytes());
    let bytes = serde_json::to_vec(event).expect("json serialize cannot fail");
    h.update(&bytes);
    hex::encode(h.finalize())
}
