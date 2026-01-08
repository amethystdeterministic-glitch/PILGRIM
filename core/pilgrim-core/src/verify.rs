use sha2::{Digest, Sha256};
use std::fs;
use std::path::{Path, PathBuf};
use walkdir::WalkDir;

/// Canonical project hash
/// This is the ONE AND ONLY hash definition
pub fn compute_project_hash(root: &Path) -> Result<String, String> {
    if !root.exists() {
        return Err("Project root does not exist".into());
    }

    let mut files: Vec<PathBuf> = Vec::new();

    for entry in WalkDir::new(root)
        .follow_links(false)
        .into_iter()
        .filter_map(Result::ok)
    {
        let path = entry.path();

        if !path.is_file() {
            continue;
        }

        // 🔒 deterministic exclusions
        if path.components().any(|c| {
            let s = c.as_os_str().to_string_lossy();
            s == "target" || s == ".git"
        }) {
            continue;
        }

        files.push(path.to_path_buf());
    }

    // 🔒 deterministic ordering
    files.sort();

    let mut hasher = Sha256::new();

    for file in files {
        let rel = file.strip_prefix(root).unwrap();
        hasher.update(rel.to_string_lossy().as_bytes());
        hasher.update([0u8]);

        let data = fs::read(&file)
            .map_err(|e| format!("Failed to read {:?}: {}", file, e))?;
        hasher.update(&data);
        hasher.update([0u8]);
    }

    Ok(hex::encode(hasher.finalize()))
}
