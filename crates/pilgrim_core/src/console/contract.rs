/// Pilgrim Console Contract
/// This is the immutable interface every Pilgrim Variant must implement.
/// Think: Console ↔ Cartridge boundary.

use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PilgrimContext {
    pub execution_id: String,
    pub deterministic_hash: String,
}

pub trait PilgrimCartridge {
    /// Human-readable name (e.g. "Cancer Research v1")
    fn name(&self) -> &'static str;

    /// Version of the cartridge
    fn version(&self) -> &'static str;

    /// Entry point — must be deterministic
    fn execute(&self, ctx: PilgrimContext) -> Result<PilgrimResult, PilgrimError>;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PilgrimResult {
    pub output_hash: String,
    pub metadata: String,
}

#[derive(Debug)]
pub enum PilgrimError {
    DeterminismViolation,
    InvalidInput,
    ExecutionFailed(String),
}
