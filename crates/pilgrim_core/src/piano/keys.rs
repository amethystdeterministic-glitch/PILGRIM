#[derive(Debug, Clone)]
pub struct PianoKey {
    pub id: String,
    pub weight: f32,
}

impl PianoKey {
    pub fn new(id: &str) -> Self {
        Self {
            id: id.to_string(),
            weight: 1.0,
        }
    }
}
