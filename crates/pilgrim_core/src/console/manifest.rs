//! Pilgrim Console Manifest
//! Defines the stable interface that all variants must plug into.

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsoleManifest {
    pub console_version: String,
    pub deterministic_core: bool,
    pub ledger_enabled: bool,
    pub supports_variants: bool,
}

impl ConsoleManifest {
    pub fn v1() -> Self {
        Self {
            console_version: "pilgrim-console-v1.0.1".to_string(),
            deterministic_core: true,
            ledger_enabled: true,
            supports_variants: true,
        }
    }
}
