// pilgrim_identity v0.1.0 (Stub C)
// Deterministic "identity proof" flow.
// NOT cryptographically secure yet, but:
// - stable interfaces
// - deterministic fingerprints + proofs
// - can be swapped for ed25519 signatures later with no API break

use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use thiserror::Error;

pub type Result<T> = std::result::Result<T, IdentityError>;

#[derive(Debug, Error)]
pub enum IdentityError {
    #[error("invalid subject id")]
    InvalidSubjectId,
    #[error("invalid public key bytes")]
    InvalidPublicKey,
    #[error("proof verification failed")]
    VerificationFailed,
}

/// Minimal identity record.
/// In Stub C, we treat `pubkey_bytes` as an arbitrary byte-string.
/// Fingerprint is SHA-256(pubkey_bytes) hex.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct Identity {
    pub subject_id: String,
    pub pubkey_fingerprint: String,
}

/// Proof that an identity "authorized" an action.
/// Stub C uses deterministic hashing instead of real signatures.
#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct IdentityProof {
    pub subject_id: String,
    pub pubkey_fingerprint: String,
    pub message_hash: String,
    pub proof_hash: String,
}

impl Identity {
    /// Create identity from subject_id + raw pubkey bytes (or any stable identifier bytes).
    pub fn new(subject_id: impl Into<String>, pubkey_bytes: &[u8]) -> Result<Self> {
        let subject_id = subject_id.into().trim().to_string();
        if subject_id.is_empty() {
            return Err(IdentityError::InvalidSubjectId);
        }
        if pubkey_bytes.is_empty() {
            return Err(IdentityError::InvalidPublicKey);
        }

        let pubkey_fingerprint = sha256_hex(pubkey_bytes);

        Ok(Self {
            subject_id,
            pubkey_fingerprint,
        })
    }

    /// Produce a deterministic "proof" for a given message hash.
    ///
    /// Stub C "signature":
    /// proof_hash = SHA-256(pubkey_fingerprint || ":" || message_hash)
    pub fn prove(&self, message_hash: impl Into<String>) -> IdentityProof {
        let message_hash = message_hash.into();
        let proof_hash = sha256_hex(format!("{}:{}", self.pubkey_fingerprint, message_hash).as_bytes());

        IdentityProof {
            subject_id: self.subject_id.clone(),
            pubkey_fingerprint: self.pubkey_fingerprint.clone(),
            message_hash,
            proof_hash,
        }
    }

    /// Verify a proof against this identity.
    pub fn verify(&self, proof: &IdentityProof) -> Result<()> {
        if proof.subject_id != self.subject_id {
            return Err(IdentityError::VerificationFailed);
        }
        if proof.pubkey_fingerprint != self.pubkey_fingerprint {
            return Err(IdentityError::VerificationFailed);
        }

        let expected = sha256_hex(format!("{}:{}", self.pubkey_fingerprint, proof.message_hash).as_bytes());
        if expected != proof.proof_hash {
            return Err(IdentityError::VerificationFailed);
        }

        Ok(())
    }
}

/// Utility: SHA-256 hex string
pub fn sha256_hex(bytes: &[u8]) -> String {
    let mut h = Sha256::new();
    h.update(bytes);
    hex::encode(h.finalize())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn identity_fingerprint_is_stable() {
        let id1 = Identity::new("ernesto_lopez", b"demo-pubkey-bytes").unwrap();
        let id2 = Identity::new("ernesto_lopez", b"demo-pubkey-bytes").unwrap();
        assert_eq!(id1, id2);
    }

    #[test]
    fn proof_verifies() {
        let identity = Identity::new("ernesto_lopez", b"demo-pubkey-bytes").unwrap();
        let msg_hash = sha256_hex(b"hello-world");
        let proof = identity.prove(msg_hash);
        identity.verify(&proof).unwrap();
    }

    #[test]
    fn proof_fails_on_tamper() {
        let identity = Identity::new("ernesto_lopez", b"demo-pubkey-bytes").unwrap();
        let msg_hash = sha256_hex(b"hello-world");
        let mut proof = identity.prove(msg_hash);

        proof.proof_hash = "deadbeef".to_string();
        assert!(identity.verify(&proof).is_err());
    }
}
