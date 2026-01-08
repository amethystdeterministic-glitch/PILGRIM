use std::env;
use std::fs;
use std::path::PathBuf;

use ghostpass_core::{
    GhostPassIdentity,
    mint_token,
    verify_token,
};

use zyte_core::ZyteRequest;

use base64::engine::general_purpose::STANDARD;
use base64::Engine;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 3 {
        panic!("Usage: amethyst-browser <url> <subject>");
    }

    let url = args[1].clone();
    let subject = args[2].clone();

    println!("[BROWSER] Starting Amethyst Browser");

    // === Load deterministic policy ===
    let policy_path = PathBuf::from("generated/amethyst-browser-android/runtime.policy.json");
    if !policy_path.exists() {
        panic!("[BROWSER] Missing runtime policy");
    }

    let policy_bytes = fs::read(&policy_path)
        .expect("[BROWSER] Failed to read runtime policy");

    // === Identity ===
    let identity = GhostPassIdentity::from_policy(&policy_bytes);

    // === Mint token ===
    let token = mint_token(&identity, &subject);

    println!("[BROWSER] Subject: {}", token.subject);
    println!("[BROWSER] Fingerprint: {}", token.fingerprint);
    println!(
        "[BROWSER] Signature (base64): {}",
        STANDARD.encode(&token.signature)
    );

    // === Verify token ===
    let valid = verify_token(&identity, &token);
    println!("[BROWSER] Token valid: {}", valid);

    if !valid {
        panic!("[BROWSER] Identity verification FAILED");
    }

    // === Persist token capsule ===
    fs::create_dir_all("ghostpass").ok();
    fs::write(
        "ghostpass/token.json",
        serde_json::to_vec_pretty(&token).unwrap(),
    )
    .expect("[BROWSER] Failed to write token");

    println!("[BROWSER] Token capsule written");

    // === Zyte request (policy-gated) ===
    let request = ZyteRequest::new(&url, &token.fingerprint);

    println!(
        "[BROWSER] Zyte request authorised: {} (fp={})",
        request.url(),
        request.fingerprint()
    );

    // === Deterministic proof write ===
    let proof_path = PathBuf::from("generated/amethyst-browser-android/proof.json");
    fs::create_dir_all(proof_path.parent().unwrap()).ok();
    fs::write(&proof_path, b"{ \"status\": \"proof-written\" }")
        .expect("[BROWSER] Failed to write proof");

    println!("[BROWSER] Proof written");
    println!("[BROWSER] Amethyst Browser SESSION ACTIVE");
}
