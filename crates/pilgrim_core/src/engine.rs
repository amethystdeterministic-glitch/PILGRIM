#[derive(Default)]
pub struct PilgrimEngine {
    ticks: u64,
}

impl PilgrimEngine {
    pub fn advance(&mut self, _event: &str) {
        self.ticks += 1;
    }

    // Alias required by tests / constraints layer
    pub fn step(&mut self, event: &str) {
        self.advance(event);
    }

    pub fn ticks(&self) -> u64 {
        self.ticks
    }
}
