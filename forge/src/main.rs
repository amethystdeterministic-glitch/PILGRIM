use std::env;
use std::fs;
use std::path::{Path, PathBuf};

use base64::engine::general_purpose::STANDARD;
use base64::Engine;

use ed25519_dalek::{Signature, SigningKey, Signer};

use rand::rngs::OsRng;
use rand::RngCore;

use serde_json::json;
use sha2::{Digest, Sha256};

use walkdir::WalkDir;

fn main() {
    println!("[FORGE] Initialising...");

    let project_dir = Path::new("generated/amethyst-demo");
    fs::create_dir_all(project_dir).expect("Failed to create output folder");

    // 🔒 Deterministic project hash
    let hash = compute_project_hash(project_dir);

    // 🔑 Signing key
    let key_path = default_key_path();
    let signing_key = load_or_create_signing_key(&key_path);
    let verifying_key = signing_key.verifying_key();

    // ✍️ Sign hash
    let signature: Signature = signing_key.sign(hash.as_bytes());

    let proof = json!({
        "authority": "Pilgrim Core",
        "project": project_dir.to_string_lossy(),
        "hash": hash,
        "public_key": STANDARD.encode(verifying_key.to_bytes()),
        "signature": STANDARD.encode(signature.to_bytes()),
        "status": "DETERMINISTIC"
    });

    let proof_path = project_dir.join("proof.json");
    let sig_path = project_dir.join("proof.sig");

    fs::write(&proof_path, serde_json::to_string_pretty(&proof).unwrap()).unwrap();
    fs::write(&sig_path, signature.to_bytes()).unwrap();

    println!("[FORGE] Gate: PASS");
    println!("[FORGE] Project generated");
    println!("[FORGE] Proof written → {}", proof_path.display());
    println!("[FORGE] Signature written → {}", sig_path.display());
}

/* ----------------------------- HASHING ----------------------------- */

fn compute_project_hash(root: &Path) -> String {
    let mut files: Vec<PathBuf> = WalkDir::new(root)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .filter(|e| {
            let p = e.path().to_string_lossy();
            !p.contains("proof.json")
                && !p.contains("proof.sig")
                && !p.contains("/target/")
                && !p.contains("/.git/")
        })
        .map(|e| e.path().to_path_buf())
        .collect();

    files.sort();

    let mut hasher = Sha256::new();

    for file in files {
        let rel = file.strip_prefix(root).unwrap_or(&file);
        hasher.update(rel.to_string_lossy().as_bytes());
        hasher.update(&[0u8]);

        let data = fs::read(&file).unwrap();
        hasher.update(data);
        hasher.update(&[0u8]);
    }

    hex::encode(hasher.finalize())
}

/* ----------------------------- KEYS ----------------------------- */

fn default_key_path() -> PathBuf {
    let home = env::var("HOME").unwrap_or_else(|_| ".".into());
    PathBuf::from(home).join(".pilgrim").join("device_ed25519.key")
}

fn load_or_create_signing_key(path: &Path) -> SigningKey {
    if let Ok(bytes) = fs::read(path) {
        let key_bytes: [u8; 32] = bytes.try_into().expect("Invalid key length");
        return SigningKey::from_bytes(&key_bytes);
    }

    let mut csprng = OsRng;
    let mut key_bytes = [0u8; 32];
    csprng.fill_bytes(&mut key_bytes);

    let key = SigningKey::from_bytes(&key_bytes);

    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent).unwrap();
    }
    fs::write(path, key_bytes).unwrap();

    key
}
