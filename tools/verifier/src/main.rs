use std::env;
use std::fs;
use std::path::{Path, PathBuf};

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 2 {
        eprintln!("Usage: pilgrim-verifier <proof.json>");
        std::process::exit(1);
    }

    let proof_path = PathBuf::from(&args[1]);

    if !proof_path.exists() {
        panic!("Proof file does not exist: {}", proof_path.display());
    }

    // 🔒 Derive project root deterministically from proof location
    let project_root = proof_path
        .parent()
        .and_then(Path::parent)
        .and_then(Path::parent)
        .expect("Unable to derive project root");

    let cargo_toml = project_root.join("Cargo.toml");

    if !cargo_toml.exists() {
        panic!(
            "Missing project path (Cargo.toml not found at {})",
            cargo_toml.display()
        );
    }

    let proof = fs::read_to_string(&proof_path)
        .expect("Failed to read proof file");

    if !proof.contains("\"status\": \"proof-written\"") {
        panic!("Invalid or tampered proof");
    }

    println!("[VERIFIER] Proof OK");
}
