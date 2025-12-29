use pilgrim_core::cartridge::{Cartridge, CartridgeOutput};

/// Bridge is an adapter layer. For now it demonstrates that
/// bridge crates depend ONLY on the canonical cartridge contract.
pub struct PilgrimBridge;

impl PilgrimBridge {
    pub fn new() -> Self {
        Self
    }

    /// Run any cartridge through the bridge (future: routing, IO, transport).
    pub fn run_cartridge(
        &mut self,
        cartridge: &mut dyn Cartridge,
        tick: u64,
    ) -> CartridgeOutput {
        cartridge.run(tick)
    }
}
