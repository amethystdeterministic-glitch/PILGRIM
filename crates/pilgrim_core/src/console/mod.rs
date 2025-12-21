pub mod contracts;

use crate::piano::interface::{PianoEngine, PianoFrame};

pub struct Console<E: PianoEngine> {
    piano: E,
}

impl<E: PianoEngine> Console<E> {
    pub fn new(piano: E) -> Self {
        Self { piano }
    }

    pub fn ingest_frame(&mut self, frame: PianoFrame) {
        self.piano.ingest(frame);
    }

    pub fn score(&self) -> f64 {
        self.piano.score()
    }
}
