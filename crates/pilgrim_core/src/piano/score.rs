use super::interface::{PianoEngine, PianoFrame};

#[derive(Default)]
pub struct MockPianoEngine {
    events: usize,
}

impl PianoEngine for MockPianoEngine {
    fn ingest(&mut self, _frame: PianoFrame) {
        self.events += 1;
        println!("Piano ingest event {}", self.events);
    }

    fn score(&self) -> f64 {
        self.events as f64
    }
}
