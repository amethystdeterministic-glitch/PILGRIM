use pilgrim_core::PilgrimEngine;

#[derive(Default)]
pub struct PilgrimBridge {
    engine: PilgrimEngine,
}

impl PilgrimBridge {
    pub fn new() -> Self {
        Self {
            engine: PilgrimEngine::default(),
        }
    }

    /// Advance engine and return deterministic state
    pub fn advance(&mut self, event: &str) -> u64 {
        self.engine.step(event);
        self.engine.ticks()
    }

    /// Deterministic snapshot
    pub fn snapshot(&self) -> u64 {
        self.engine.ticks()
    }
}
