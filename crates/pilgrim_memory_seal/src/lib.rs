use pilgrim_core::cartridge::{Cartridge, CartridgeOutput};

pub struct MemorySeal {
    sealed: bool,
}

impl MemorySeal {
    pub fn new() -> Self {
        Self { sealed: false }
    }
}

impl Cartridge for MemorySeal {
    fn id(&self) -> &'static str {
        "memory_seal_v1"
    }

    fn run(&mut self, tick: u64) -> CartridgeOutput {
        self.sealed = true;

        CartridgeOutput {
            message: format!("Memory sealed at tick {}", tick),
            confidence: 0.99,
        }
    }
}
