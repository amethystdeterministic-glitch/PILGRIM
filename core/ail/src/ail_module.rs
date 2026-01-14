use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Debug, Clone)]
pub struct AILInput {
    pub raw: String,
    pub timestamp: u64,
}

#[derive(Debug, Clone)]
pub struct AILOutput {
    pub normalised: String,
    pub safe: bool,
}

pub fn ingest(input: &str) -> AILInput {
    AILInput {
        raw: input.to_string(),
        timestamp: SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap()
            .as_secs(),
    }
}

pub fn normalise(input: AILInput) -> AILOutput {
    let trimmed = input.raw.trim().to_string();
    let safe = !trimmed.is_empty();

    AILOutput {
        normalised: trimmed,
        safe,
    }
}
