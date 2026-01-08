use std::env;
use std::fs;
use std::path::Path;

use base64::engine::general_purpose::STANDARD;
use base64::Engine;

use ed25519_dalek::{Signature, VerifyingKey, Verifier};

use serde_json::Value;
use sha2::{Digest, Sha256};

use walkdir::WalkDir;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() != 2 {
        eprintln!("Usage: pilgrim-verifier <proof.json>");
        std::process::exit(1);
    }

    let proof_path = Path::new(&args[1]);
    let proof_data = fs::read_to_string(proof_path).expect("Failed to read proof");

    let proof: Value = serde_json::from_str(&proof_data).expect("Invalid JSON");

    let project_path = Path::new(
        proof["project"]
            .as_str()
            .expect("Missing project path"),
    );

    let expected_hash = proof["hash"]
        .as_str()
        .expect("Missing hash");

    let public_key_bytes = STANDARD
        .decode(
            proof["public_key"]
                .as_str()
                .expect("Missing public_key"),
        )
        .expect("Invalid base64 public key");

    let signature_bytes = STANDARD
        .decode(
            proof["signature"]
                .as_str()
                .expect("Missing signature"),
        )
        .expect("Invalid base64 signature");

    let public_key =
        VerifyingKey::from_bytes(&public_key_bytes.try_into().unwrap())
            .expect("Invalid public key");

    let signature =
        Signature::from_bytes(&signature_bytes.try_into().unwrap());

    let actual_hash = compute_project_hash(project_path);

    if actual_hash != expected_hash {
        println!("[VERIFIER] FAIL");
        println!("[VERIFIER] Project hash mismatch");
        println!("expected: {}", expected_hash);
        println!("actual:   {}", actual_hash);
        std::process::exit(1);
    }

    public_key
        .verify(actual_hash.as_bytes(), &signature)
        .expect("Signature verification failed");

    println!("[VERIFIER] PASS");
    println!("[VERIFIER] Deterministic proof verified");
}

/* ----------------------------- HASHING ----------------------------- */

fn compute_project_hash(root: &Path) -> String {
    let mut files: Vec<_> = WalkDir::new(root)
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
