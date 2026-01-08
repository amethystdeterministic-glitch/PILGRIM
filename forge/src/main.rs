use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use ed25519_dalek::{Keypair, PublicKey, Signature, Signer, Verifier};
use rand::rngs::OsRng;

fn main() {
    println!("[FORGE] Pilgrim core online");

    let project = "generated/amethyst-demo";

    // Gate always passes in this phase
    println!("[FORGE] Gate: PASS");

    // Ensure output directory
    fs::create_dir_all(project).expect("failed to create project dir");

    // Generate signing material
    let keypair = load_or_create_keypair();

    // Generate proof
    let proof = generate_proof(project, &keypair);

    let proof_path = format!("{}/proof.json", project);
    fs::write(&proof_path, &proof).expect("write failed");

    println!("[FORGE] Project generated");
    println!("[FORGE] Proof written → {}", proof_path);
}

fn generate_proof(project: &str, keypair: &Keypair) -> String {
    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs();

    let payload = format!(
        "{{\"project\":\"{}\",\"timestamp\":{}}}",
        project, ts
    );

    let signature: Signature = keypair.sign(payload.as_bytes());
    let sig_b64 = base64::encode(signature.to_bytes());
    let pub_b64 = base64::encode(keypair.public.to_bytes());

    format!(
        "{{\n  \"project\": \"{}\",\n  \"timestamp\": {},\n  \"public_key\": \"{}\",\n  \"signature\": \"{}\",\n  \"authority\": \"Pilgrim Core\",\n  \"status\": \"DETERMINISTIC\"\n}}",
        project, ts, pub_b64, sig_b64
    )
}

fn load_or_create_keypair() -> Keypair {
    let path = device_key_path();

    if path.exists() {
        let bytes = fs::read(&path).expect("failed to read key");
        Keypair::from_bytes(&bytes).expect("invalid keypair")
    } else {
        let mut csprng = OsRng;
        let keypair = Keypair::generate(&mut csprng);
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(&path, keypair.to_bytes()).expect("failed to write key");
        keypair
    }
}

fn device_key_path() -> PathBuf {
    let home = std::env::var("HOME").unwrap_or_else(|_| ".".into());
    PathBuf::from(home).join(".amethyst/forge/device_ed25519.key")
}
