use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsoleContract {
    pub name: String,
    pub version: String,
}
