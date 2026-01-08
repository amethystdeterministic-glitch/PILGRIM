use std::fs;
use std::path::PathBuf;

/// Minimal "Pilgrim ↔ Forge" gate.
/// Forge is allowed only if a local key matches.
/// This is intentionally simple (no deps) and works fully offline.
///
/// Gate sources (first match wins):
/// 1) ENV: AMETHYST_FORGE_KEY
/// 2) File: ~/.amethyst/forge.key  (one-line key)
///
/// Default dev key: LOCAL-DEV-OK
pub fn forge_gate(project_name: &str) -> Result<(), ForgeGateError> {
    // Optional: basic project name sanity
    if project_name.trim().is_empty() {
        return Err(ForgeGateError::InvalidProjectName);
    }

    let expected = "LOCAL-DEV-OK";

    // 1) ENV
    if let Ok(v) = std::env::var("AMETHYST_FORGE_KEY") {
        let v = v.trim();
        if v == expected {
            return Ok(());
        } else {
            return Err(ForgeGateError::Denied);
        }
    }

    // 2) ~/.amethyst/forge.key
    let mut p = home_dir().ok_or(ForgeGateError::NoHomeDir)?;
    p.push(".amethyst");
    p.push("forge.key");

    if p.exists() {
        let contents = fs::read_to_string(&p).map_err(|_| ForgeGateError::KeyReadFailed)?;
        if contents.trim() == expected {
            return Ok(());
        } else {
            return Err(ForgeGateError::Denied);
        }
    }

    Err(ForgeGateError::MissingKey)
}

pub fn pilgrim_status() -> &'static str {
    "Pilgrim core online"
}

#[derive(Debug)]
pub enum ForgeGateError {
    InvalidProjectName,
    MissingKey,
    NoHomeDir,
    KeyReadFailed,
    Denied,
}

fn home_dir() -> Option<PathBuf> {
    // Termux usually has $HOME set.
    std::env::var_os("HOME").map(PathBuf::from)
}
