use serde::{Serialize, Deserialize};
use crate::piano::interface::PianoFrame;

#[derive(Debug, Serialize, Deserialize)]
pub struct ConsoleContract {
    pub frame: PianoFrame,
}
