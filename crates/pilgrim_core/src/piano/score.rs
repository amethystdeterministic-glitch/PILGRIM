use crate::piano::interface::{PianoEngine, PianoFrame};

pub struct MockPianoEngine {
    events: usize,
}

impl MockPianoEngine {
    pub fn new() -> Self {
        Self { events: 0 }
    }
}

impl PianoEngine for MockPianoEngine {
    fn ingest(&mut self, _frame: PianoFrame) {
        self.events += 1;
    }

    fn score(&self) -> f64 {
        self.events as f64
    }
}
