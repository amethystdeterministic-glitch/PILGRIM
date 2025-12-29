use serde::{Deserialize, Serialize};

/// Canonical output type shared by all cartridges
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CartridgeOutput {
    pub message: String,
    pub confidence: f32,
}

/// Canonical cartridge contract (engine-agnostic)
pub trait Cartridge {
    /// Stable identifier for mandate + identity checks
    fn id(&self) -> &'static str;

    /// Execute one deterministic tick
    fn run(&mut self, tick: u64) -> CartridgeOutput;
}
