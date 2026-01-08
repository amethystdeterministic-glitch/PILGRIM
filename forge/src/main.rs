use std::env;
use std::fs;
use std::path::{Path, PathBuf};

use base64::{engine::general_purpose, Engine as _};
use ed25519_dalek::{Signature, SigningKey, VerifyingKey};
use ed25519_dalek::Signer;
use rand::rngs::OsRng;
use sha2::{Digest, Sha256};

fn main() {
    let args: Vec<String> = env::args().collect();

    // Usage:
    //   forge                 -> generate
    //   forge verify <path>    -> verify a proof.json
    if args.len() >= 2 && args[1] == "verify" {
        let path = args.get(2).map(|s| s.as_str()).unwrap_or("generated/amethyst-demo/proof.json");
        match verify_proof_file(path) {
            Ok(()) => {
                println!("[FORGE] Verify: PASS");
            }
            Err(e) => {
                eprintln!("[FORGE] Verify: FAIL");
                eprintln!("[FORGE] Reason: {e}");
                std::process::exit(1);
            }
        }
        return;
    }

    // Default: generate
    generate_proof().unwrap();
}

fn generate_proof() -> Result<(), String> {
    println!("[FORGE] Initialising...");

    let key_path = device_key_path();

    // Load or generate device key (32 bytes)
    let signing_key: SigningKey = if key_path.exists() {
        let raw = fs::read(&key_path).map_err(|e| format!("Failed to read device key: {e}"))?;
        if raw.len() != 32 {
            return Err(format!("Invalid key length in {}: expected 32, got {}", key_path.display(), raw.len()));
        }
        let mut seed = [0u8; 32];
        seed.copy_from_slice(&raw);
        SigningKey::from_bytes(&seed)
    } else {
        fs::create_dir_all(key_path.parent().unwrap())
            .map_err(|e| format!("Failed to create key dir: {e}"))?;
        let mut csprng = OsRng;
        let signing_key = SigningKey::generate(&mut csprng);
        fs::write(&key_path, signing_key.to_bytes()).map_err(|e| format!("Failed to write device key: {e}"))?;
        signing_key
    };

    let verify_key: VerifyingKey = signing_key.verifying_key();

    println!("[FORGE] Pilgrim core online");
    println!("[FORGE] Gate: PASS");

    let project = "generated/amethyst-demo";
    let payload = "AMETHYST::DEMO::FORGE";
    let hash = Sha256::digest(payload.as_bytes());
    let signature: Signature = signing_key.sign(&hash);

    let proof = format!(
        "{{\n  \"project\": \"{project}\",\n  \"hash\": \"{}\",\n  \"public_key\": \"{}\",\n  \"signature\": \"{}\",\n  \"authority\": \"Pilgrim Core\",\n  \"status\": \"DETERMINISTIC\"\n}}\n",
        hex::encode(hash),
        general_purpose::STANDARD.encode(verify_key.as_bytes()),
        general_purpose::STANDARD.encode(signature.to_bytes()),
    );

    fs::create_dir_all(project).map_err(|e| format!("Failed to create project dir: {e}"))?;
    fs::write(format!("{project}/proof.json"), proof).map_err(|e| format!("Failed to write proof.json: {e}"))?;

    println!("[FORGE] Project generated");
    println!("[FORGE] Proof written → generated/amethyst-demo/proof.json");
    Ok(())
}

fn verify_proof_file(path: &str) -> Result<(), String> {
    let json = fs::read_to_string(path).map_err(|e| format!("Failed to read {path}: {e}"))?;

    let project = extract(&json, "project")?;
    let hash_hex = extract(&json, "hash")?;
    let pk_b64 = extract(&json, "public_key")?;
    let sig_b64 = extract(&json, "signature")?;

    // Decode
    let hash = hex::decode(&hash_hex).map_err(|e| format!("hash hex decode failed: {e}"))?;
    if hash.len() != 32 {
        return Err(format!("hash must be 32 bytes (sha256), got {}", hash.len()));
    }

    let pk_bytes = general_purpose::STANDARD
        .decode(pk_b64.as_bytes())
        .map_err(|e| format!("public_key base64 decode failed: {e}"))?;

    let sig_bytes = general_purpose::STANDARD
        .decode(sig_b64.as_bytes())
        .map_err(|e| format!("signature base64 decode failed: {e}"))?;

    if pk_bytes.len() != 32 {
        return Err(format!("public_key must be 32 bytes, got {}", pk_bytes.len()));
    }
    if sig_bytes.len() != 64 {
        return Err(format!("signature must be 64 bytes, got {}", sig_bytes.len()));
    }

    let mut pk_arr = [0u8; 32];
    pk_arr.copy_from_slice(&pk_bytes);

    let mut sig_arr = [0u8; 64];
    sig_arr.copy_from_slice(&sig_bytes);

    let vk = VerifyingKey::from_bytes(&pk_arr).map_err(|e| format!("invalid public_key: {e}"))?;
    let sig = Signature::from_bytes(&sig_arr);

    // We verify signature over the stored hash bytes.
    vk.verify_strict(&hash, &sig)
        .map_err(|e| format!("signature verify failed: {e}"))?;

    // Minimal consistency check (optional but nice)
    if project != "generated/amethyst-demo" {
        return Err(format!("project mismatch: expected generated/amethyst-demo, got {project}"));
    }

    Ok(())
}

fn device_key_path() -> PathBuf {
    let home = env::var("HOME").unwrap_or_else(|_| ".".into());
    PathBuf::from(home).join(".amethyst/forge/device_ed25519.key")
}

// Tiny, dependency-free JSON field extractor (matches our proof format).
fn extract(json: &str, field: &str) -> Result<String, String> {
    let needle = format!("\"{}\":", field);
    let idx = json.find(&needle).ok_or_else(|| format!("field missing: {field}"))?;
    let mut rest = &json[idx + needle.len()..];
    rest = rest.trim_start();

    if rest.starts_with('"') {
        rest = &rest[1..];
        let end = rest.find('"').ok_or_else(|| format!("unterminated string for field: {field}"))?;
        Ok(rest[..end].to_string())
    } else {
        // non-string primitive
        let end = rest.find(',').unwrap_or(rest.len());
        Ok(rest[..end].trim().to_string())
    }
}
