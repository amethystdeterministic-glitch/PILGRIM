//! Pilgrim Console Contracts v1.1
//! This file defines the immutable interface boundary
//! for all future Pilgrim variants ("cartridges")

use uuid::Uuid;

/// Every Pilgrim variant MUST implement this trait.
/// This is the cartridge interface.
pub trait PilgrimVariant {
    /// Human-readable name (e.g. "Cancer Research")
    fn name(&self) -> &'static str;

    /// Semantic version of the variant
    fn version(&self) -> &'static str;

    /// Unique deterministic identifier for ledger binding
    fn variant_id(&self) -> Uuid;

    /// Called once when the variant is mounted
    fn initialize(&self) -> Result<(), String>;

    /// Deterministic execution entrypoint
    fn execute(&self, input_hash: &str) -> Result<String, String>;
}
