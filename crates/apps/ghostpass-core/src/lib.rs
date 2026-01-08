use ed25519_dalek::{
    SigningKey,
    VerifyingKey,
    Signature,
    Signer,
    Verifier,
};
use sha2::{Sha256, Digest};
use serde::{Serialize, Deserialize};

/// A deterministic GhostPass identity
pub struct GhostPassIdentity {
    signing: SigningKey,
    verifying: VerifyingKey,
}

impl GhostPassIdentity {
    /// Derive identity deterministically from runtime policy bytes
    pub fn from_policy(policy_bytes: &[u8]) -> Self {
        let mut hasher = Sha256::new();
        hasher.update(policy_bytes);
        let hash = hasher.finalize();

        let secret: [u8; 32] = hash[..32]
            .try_into()
            .expect("hash must be 32 bytes");

        let signing = SigningKey::from_bytes(&secret);
        let verifying = signing.verifying_key();

        Self { signing, verifying }
    }

    pub fn sign(&self, msg: &[u8]) -> Signature {
        self.signing.sign(msg)
    }

    pub fn verifying_key(&self) -> &VerifyingKey {
        &self.verifying
    }
}

/// A deterministic GhostPass token
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GhostPassToken {
    pub subject: String,
    pub fingerprint: String,
    pub signature: Vec<u8>,
}

/// Create a deterministic token for a subject
pub fn mint_token(
    identity: &GhostPassIdentity,
    subject: &str,
) -> GhostPassToken {
    let fingerprint = token_fingerprint(subject);
    let sig = identity.sign(fingerprint.as_bytes());

    GhostPassToken {
        subject: subject.to_string(),
        fingerprint,
        signature: sig.to_bytes().to_vec(),
    }
}

/// Verify a token against an identity
pub fn verify_token(
    identity: &GhostPassIdentity,
    token: &GhostPassToken,
) -> bool {
    let sig = match Signature::from_slice(&token.signature) {
        Ok(s) => s,
        Err(_) => return false,
    };

    identity
        .verifying_key()
        .verify(token.fingerprint.as_bytes(), &sig)
        .is_ok()
}

/// Deterministic token fingerprint
pub fn token_fingerprint(subject: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(b"GHOSTPASS::TOKEN::V1");
    hasher.update(subject.as_bytes());
    hex::encode(hasher.finalize())
}
