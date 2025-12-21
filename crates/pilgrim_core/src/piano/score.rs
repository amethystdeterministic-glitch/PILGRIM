use super::interface::{PianoEngine, PianoFrame};

pub struct MockPianoEngine {
    pub frames: Vec<PianoFrame>,
}

impl MockPianoEngine {
    pub fn new() -> Self {
        Self { frames: Vec::new() }
    }
}

impl PianoEngine for MockPianoEngine {
    fn ingest(&mut self, frame: PianoFrame) {
        self.frames.push(frame);
    }

    fn score(&self) -> f64 {
        self.frames.len() as f64
    }
}
