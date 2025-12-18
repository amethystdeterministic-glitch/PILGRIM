use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};

/// Handshake contract version (must be embedded into every envelope).
pub const PROTOCOL_VERSION: &str = "amethyst-pilgrim-handshake/1";

/// Hash algorithms allowed by the contract.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum HashAlgo {
    Sha256,
}

/// Privacy tier is part of the contract (no inference).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum PrivacyTier {
    Public,
    Protected,
    Confidential,
    Sealed,
}

/// Operational constraints to keep runs bounded and auditable.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Constraints {
    pub max_steps: u32,
    pub max_runtime_ms: u64,
    pub require_logs: bool,
    pub privacy: PrivacyTier,
}

impl Default for Constraints {
    fn default() -> Self {
        Self {
            max_steps: 10_000,
            max_runtime_ms: 10_000,
            require_logs: true,
            privacy: PrivacyTier::Protected,
        }
    }
}

/// A single input datum. (No maps: deterministic field ordering, no key-order ambiguity.)
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Datum {
    pub key: String,
    pub value: String,
}

/// Intent is the human-facing “ask” that becomes a deterministic run.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Intent {
    /// Deterministic identifier (client-generated). Can be UUID, ULID, etc.
    pub intent_id: String,
    /// Unix epoch milliseconds (client clock). Logged; not trusted as “truth”.
    pub created_unix_ms: u64,
    /// Optional operator label (team / device / lab station).
    pub operator: Option<String>,
    /// The statement of intent (what the operator wants answered).
    pub statement: String,
    /// Input data (explicit and bounded).
    pub inputs: Vec<Datum>,
    /// Contract constraints (bounded compute).
    pub constraints: Constraints,
    /// Nonce to prevent accidental replay collisions when intent_id reused.
    pub nonce: u64,
}

/// A checksum bound to the envelope’s canonical bytes.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Checksum {
    pub algo: HashAlgo,
    pub hex: String,
}

/// A request envelope: versioned, canonical, and self-checking.
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct RequestEnvelope {
    pub protocol: String,
    pub intent: Intent,
    pub checksum: Checksum,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub enum RunStatus {
    Idle,
    Accepted,
    Rejected,
    Running,
    Completed,
    Failed,
}

/// A minimal response contract (no engine logic here).
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct ResponseEnvelope {
    pub protocol: String,
    pub intent_id: String,
    pub status: RunStatus,
    /// Human-readable short status message (safe to show in UI).
    pub message: String,
    /// Optional machine payload (engine will define exact schema later).
    pub payload_json: Option<String>,
    /// Optional canonical logs reference (engine will define later).
    pub logs_json: Option<String>,
    pub checksum: Checksum,
}

/// Contract errors (pure handshake layer).
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum HandshakeError {
    ProtocolMismatch { expected: String, got: String },
    ChecksumMismatch,
    BadChecksumFormat,
    BadJson,
}

fn sha256_hex(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    let out = hasher.finalize();
    hex::encode(out)
}

/// Canonical bytes for deterministic hashing:
/// - JSON serialization of the struct (field order is deterministic for structs)
/// - No maps used in this contract (to avoid key-order ambiguity)
fn canonical_json_bytes<T: Serialize>(value: &T) -> Result<Vec<u8>, HandshakeError> {
    serde_json::to_vec(value).map_err(|_| HandshakeError::BadJson)
}

impl RequestEnvelope {
    /// Create a request envelope with correct protocol + checksum.
    pub fn new(intent: Intent) -> Self {
        let mut env = Self {
            protocol: PROTOCOL_VERSION.to_string(),
            intent,
            checksum: Checksum {
                algo: HashAlgo::Sha256,
                hex: String::new(),
            },
        };
        env.checksum.hex = env.compute_checksum_hex();
        env
    }

    /// Compute checksum over canonical bytes of (protocol + intent).
    fn compute_checksum_hex(&self) -> String {
        // Hash only stable fields (exclude checksum itself to avoid recursion)
        let to_hash = RequestToHash {
            protocol: self.protocol.clone(),
            intent: self.intent.clone(),
        };
        let bytes = canonical_json_bytes(&to_hash).unwrap_or_else(|_| Vec::new());
        sha256_hex(&bytes)
    }

    /// Verify protocol + checksum.
    pub fn verify(&self) -> Result<(), HandshakeError> {
        if self.protocol != PROTOCOL_VERSION {
            return Err(HandshakeError::ProtocolMismatch {
                expected: PROTOCOL_VERSION.to_string(),
                got: self.protocol.clone(),
            });
        }
        match self.checksum.algo {
            HashAlgo::Sha256 => {
                let expected = self.compute_checksum_hex();
                if expected != self.checksum.hex {
                    return Err(HandshakeError::ChecksumMismatch);
                }
                Ok(())
            }
        }
    }
}

impl ResponseEnvelope {
    pub fn new(intent_id: String, status: RunStatus, message: String) -> Self {
        let mut env = Self {
            protocol: PROTOCOL_VERSION.to_string(),
            intent_id,
            status,
            message,
            payload_json: None,
            logs_json: None,
            checksum: Checksum {
                algo: HashAlgo::Sha256,
                hex: String::new(),
            },
        };
        env.checksum.hex = env.compute_checksum_hex();
        env
    }

    fn compute_checksum_hex(&self) -> String {
        let to_hash = ResponseToHash {
            protocol: self.protocol.clone(),
            intent_id: self.intent_id.clone(),
            status: self.status.clone(),
            message: self.message.clone(),
            payload_json: self.payload_json.clone(),
            logs_json: self.logs_json.clone(),
        };
        let bytes = canonical_json_bytes(&to_hash).unwrap_or_else(|_| Vec::new());
        sha256_hex(&bytes)
    }

    pub fn verify(&self) -> Result<(), HandshakeError> {
        if self.protocol != PROTOCOL_VERSION {
            return Err(HandshakeError::ProtocolMismatch {
                expected: PROTOCOL_VERSION.to_string(),
                got: self.protocol.clone(),
            });
        }
        let expected = self.compute_checksum_hex();
        if expected != self.checksum.hex {
            return Err(HandshakeError::ChecksumMismatch);
        }
        Ok(())
    }
}

/// Internal structs: explicitly define what gets hashed (excludes checksum fields).
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
struct RequestToHash {
    protocol: String,
    intent: Intent,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
struct ResponseToHash {
    protocol: String,
    intent_id: String,
    status: RunStatus,
    message: String,
    payload_json: Option<String>,
    logs_json: Option<String>,
}
