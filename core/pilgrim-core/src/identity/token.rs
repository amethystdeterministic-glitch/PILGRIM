use ed25519_dalek::{
    Signature,
    VerifyingKey,
    Verifier, // ← THIS IS CRITICAL
};

#[derive(Debug)]
pub enum IdentityError {
    InvalidKey,
    InvalidSignature,
}

pub fn verify_token(
    key_bytes: &[u8; 32],
    message: &[u8],
    signature_bytes: &[u8; 64],
) -> Result<(), IdentityError> {
    let key = VerifyingKey::from_bytes(key_bytes)
        .map_err(|_| IdentityError::InvalidKey)?;

    let signature = Signature::from_bytes(signature_bytes);

    key.verify(message, &signature)
        .map_err(|_| IdentityError::InvalidSignature)
}
