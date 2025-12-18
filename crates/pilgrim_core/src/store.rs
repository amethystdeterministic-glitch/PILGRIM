use crate::trace::hash_bytes;
use serde::{Deserialize, Serialize};
use std::fs::OpenOptions;
use std::io::{Read, Write};
use std::path::{Path, PathBuf};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct StoreRecord {
    pub index: u64,
    pub kind: String,
    pub payload_json: String,
    pub prev_hash: String,
    pub record_hash: String,
}

#[derive(Debug)]
pub struct AppendOnlyStore {
    path: PathBuf,
}

impl AppendOnlyStore {
    pub fn open<P: AsRef<Path>>(path: P) -> Self {
        Self {
            path: path.as_ref().to_path_buf(),
        }
    }

    pub fn append_json(&self, kind: &str, payload_json: &str) -> std::io::Result<StoreRecord> {
        let mut existing = String::new();

        if self.path.exists() {
            let mut f = OpenOptions::new().read(true).open(&self.path)?;
            f.read_to_string(&mut existing)?;
        }

        let mut last_hash = "GENESIS".to_string();
        let mut last_index = 0u64;

        for line in existing.lines() {
            if line.trim().is_empty() {
                continue;
            }
            if let Ok(rec) = serde_json::from_str::<StoreRecord>(line) {
                last_hash = rec.record_hash.clone();
                last_index = rec.index + 1;
            }
        }

        let to_hash = format!("{}|{}|{}", last_hash, kind, payload_json);
        let record_hash = hash_bytes(to_hash.as_bytes());

        let rec = StoreRecord {
            index: last_index,
            kind: kind.to_string(),
            payload_json: payload_json.to_string(),
            prev_hash: last_hash,
            record_hash,
        };

        let mut f = OpenOptions::new()
            .create(true)
            .append(true)
            .open(&self.path)?;

        writeln!(f, "{}", serde_json::to_string(&rec).unwrap())?;

        Ok(rec)
    }

    pub fn verify(&self) -> std::io::Result<bool> {
        if !self.path.exists() {
            return Ok(true);
        }

        let mut content = String::new();
        OpenOptions::new()
            .read(true)
            .open(&self.path)?
            .read_to_string(&mut content)?;

        let mut expected_prev = "GENESIS".to_string();

        for line in content.lines() {
            if line.trim().is_empty() {
                continue;
            }

            let rec: StoreRecord = serde_json::from_str(line).unwrap();

            if rec.prev_hash != expected_prev {
                return Ok(false);
            }

            let to_hash = format!("{}|{}|{}", rec.prev_hash, rec.kind, rec.payload_json);
            let expected_hash = hash_bytes(to_hash.as_bytes());

            if rec.record_hash != expected_hash {
                return Ok(false);
            }

            expected_prev = rec.record_hash.clone();
        }

        Ok(true)
    }
}
