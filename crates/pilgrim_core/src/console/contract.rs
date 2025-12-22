use crate::piano::interface::{PianoEngine, PianoFrame};

pub struct ConsoleContract<E: PianoEngine> {
    piano: E,
}

impl<E: PianoEngine> ConsoleContract<E> {
    pub fn new(piano: E) -> Self {
        Self { piano }
    }

    pub fn ingest_frame(&mut self, frame: PianoFrame) {
        self.piano.ingest(frame);
    }

    pub fn score(&self) -> f64 {
        self.piano.score()
    }

    pub fn reset(&mut self) {
        self.piano.reset();
    }
}
