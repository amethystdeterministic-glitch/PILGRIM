use super::interface::{PianoEngine, PianoFrame};

pub struct MockPianoEngine {
    events: Vec<PianoFrame>,
}

impl MockPianoEngine {
    pub fn new() -> Self {
        Self {
            events: Vec::new(),
        }
    }
}

impl PianoEngine for MockPianoEngine {
    fn ingest(&mut self, frame: PianoFrame) {
        self.events.push(frame);
    }

    fn score(&self) -> f64 {
        self.events.len() as f64
    }
}
