use std::env;
use std::fs;
use std::path::{Path, PathBuf};

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
    let proof_data = fs::read_to_string(proof_path).expect("Unable to read proof.json");
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

    let verifying_key =
        VerifyingKey::from_bytes(public_key_bytes.as_slice().try_into().unwrap())
            .expect("Invalid public key");

    let signature =
        Signature::from_bytes(signature_bytes.as_slice().try_into().unwrap());

    let policy_path = project_path.join("runtime.policy.json");
    if policy_path.exists() {
        let policy_hash = sha256_file(&policy_path);
        println!("[VERIFIER] Runtime policy present");
        println!(
            "[VERIFIER] runtime.policy.json sha256: {}",
            policy_hash
        );
    }

    let actual_hash = compute_project_hash(project_path);

    if actual_hash != expected_hash {
        println!("[VERIFIER] FAIL");
        println!("[VERIFIER] Project hash mismatch");
        println!("expected: {}", expected_hash);
        println!("actual:   {}", actual_hash);
        std::process::exit(1);
    }

    verifying_key
        .verify(actual_hash.as_bytes(), &signature)
        .expect("Signature verification failed");

    println!("[VERIFIER] PASS");
    println!("[VERIFIER] Deterministic proof verified");
}

fn compute_project_hash(root: &Path) -> String {
    let mut files: Vec<PathBuf> = WalkDir::new(root)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.file_type().is_file())
        .filter(|e| {
            let p = e.path().to_string_lossy();
            !p.contains("proof.json")
                && !p.contains("proof.sig")
                && !p.contains("runtime.policy.sha256")
                && !p.contains("/target/")
                && !p.contains("/.git/")
        })
        .map(|e| e.path().to_path_buf())
        .collect();

    files.sort();

    let mut hasher = Sha256::new();

    for file in files {
        let rel = file.strip_prefix(root).unwrap();
        hasher.update(rel.to_string_lossy().as_bytes());
        hasher.update(&[0u8]);
        let data = fs::read(&file).unwrap();
        hasher.update(data);
        hasher.update(&[0u8]);
    }

    hex::encode(hasher.finalize())
}

fn sha256_file(path: &Path) -> String {
    let data = fs::read(path).unwrap();
    hex::encode(Sha256::digest(data))
}
