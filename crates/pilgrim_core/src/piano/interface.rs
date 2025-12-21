#[derive(Clone, Debug)]
pub struct PianoFrame {
    pub key: u8,
    pub velocity: u8,
}

pub trait PianoEngine {
    fn ingest(&mut self, frame: PianoFrame);
    fn score(&self) -> f64;
}
