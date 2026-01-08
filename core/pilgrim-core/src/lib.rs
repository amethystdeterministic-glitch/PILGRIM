use base64::{engine::general_purpose, Engine as _};
use ed25519_dalek::{Signature, VerifyingKey};
use sha2::{Digest, Sha256};
use std::fs;

#[derive(Debug)]
pub enum PilgrimError {
    Io(String),
    Json(String),
    Policy(String),
    Crypto(String),
}

pub fn verify_proof_file_strict(path: &str) -> Result<(), PilgrimError> {
    let data = fs::read_to_string(path).map_err(|e| PilgrimError::Io(e.to_string()))?;
    verify_proof_json_strict(&data)
}

pub fn verify_proof_json_strict(json: &str) -> Result<(), PilgrimError> {
    let v: serde_json::Value =
        serde_json::from_str(json).map_err(|e| PilgrimError::Json(e.to_string()))?;

    // Required fields
    let authority = v["authority"].as_str().ok_or_else(|| PilgrimError::Policy("Missing authority".into()))?;
    let status = v["status"].as_str().ok_or_else(|| PilgrimError::Policy("Missing status".into()))?;
    let project = v["project"].as_str().ok_or_else(|| PilgrimError::Policy("Missing project".into()))?;
    let hash = v["hash"].as_str().ok_or_else(|| PilgrimError::Policy("Missing hash".into()))?;
    let pubkey_b64 = v["public_key"].as_str().ok_or_else(|| PilgrimError::Policy("Missing public_key".into()))?;
    let sig_b64 = v["signature"].as_str().ok_or_else(|| PilgrimError::Policy("Missing signature".into()))?;
    let forge_bin_hash = v["forge_bin_hash"].as_str().ok_or_else(|| PilgrimError::Policy("Missing forge_bin_hash".into()))?;
    let os_arch = v["os_arch"].as_str().ok_or_else(|| PilgrimError::Policy("Missing os_arch".into()))?;
    let device_binding = v["device_binding"].as_str().ok_or_else(|| PilgrimError::Policy("Missing device_binding".into()))?;

    // Policy checks
    if authority != "Pilgrim Core" {
        return Err(PilgrimError::Policy("Authority rejected".into()));
    }
    if status != "DETERMINISTIC" {
        return Err(PilgrimError::Policy("Status rejected".into()));
    }

    // Hash check: hash must be sha256(project)
    let computed_hash = sha256_hex(project.as_bytes());
    if computed_hash != hash {
        return Err(PilgrimError::Policy("Hash mismatch".into()));
    }

    // Device binding check
    let computed_binding = sha256_hex(format!("{}{}{}", pubkey_b64, forge_bin_hash, os_arch).as_bytes());
    if computed_binding != device_binding {
        return Err(PilgrimError::Policy("Device binding mismatch".into()));
    }

    // Crypto verify
    let pubkey_bytes = general_purpose::STANDARD
        .decode(pubkey_b64)
        .map_err(|e| PilgrimError::Crypto(e.to_string()))?;
    let sig_bytes = general_purpose::STANDARD
        .decode(sig_b64)
        .map_err(|e| PilgrimError::Crypto(e.to_string()))?;

    let verifying_key = VerifyingKey::from_bytes(&pubkey_bytes.try_into().map_err(|_| PilgrimError::Crypto("Bad pubkey bytes".into()))?)
        .map_err(|e| PilgrimError::Crypto(e.to_string()))?;

    let signature = Signature::from_bytes(&sig_bytes.try_into().map_err(|_| PilgrimError::Crypto("Bad signature bytes".into()))?);

    verifying_key
        .verify_strict(hash.as_bytes(), &signature)
        .map_err(|e| PilgrimError::Crypto(e.to_string()))?;

    Ok(())
}

fn sha256_hex(bytes: &[u8]) -> String {
    let mut hasher = Sha256::new();
    hasher.update(bytes);
    hex::encode(hasher.finalize())
}
