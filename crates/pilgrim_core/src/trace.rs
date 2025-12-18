use sha2::{Digest, Sha256};

#[derive(Debug, Clone)]
pub struct Trace {
    run_id: String,
    intent_statement: String,
    steps: Vec<TraceStep>,
}

#[derive(Debug, Clone)]
pub struct TraceStep {
    pub name: String,
    pub checksum_hex: String,
    pub len: usize,
}

impl Trace {
    pub fn new(run_id: &str, intent_statement: &str) -> Self {
        Self {
            run_id: run_id.to_string(),
            intent_statement: intent_statement.to_string(),
            steps: Vec::new(),
        }
    }

    pub fn push_step(&mut self, name: &str, payload: &[u8]) {
        let checksum_hex = sha256_hex(payload);
        self.steps.push(TraceStep {
            name: name.to_string(),
            checksum_hex,
            len: payload.len(),
        });
    }

    pub fn steps_len(&self) -> usize {
        self.steps.len()
    }

    pub fn finalize_hash(&self) -> String {
        // Deterministic hash of: run_id, intent_statement, and step metadata in order.
        let mut hasher = Sha256::new();
        hasher.update(self.run_id.as_bytes());
        hasher.update(b"\n");
        hasher.update(self.intent_statement.as_bytes());
        hasher.update(b"\n");

        for step in &self.steps {
            hasher.update(step.name.as_bytes());
            hasher.update(b":");
            hasher.update(step.checksum_hex.as_bytes());
            hasher.update(b":");
            hasher.update(step.len.to_string().as_bytes());
            hasher.update(b"\n");
        }

        hex::encode(hasher.finalize())
    }
}

fn sha256_hex(data: &[u8]) -> String {
    let mut h = Sha256::new();
    h.update(data);
    hex::encode(h.finalize())
}
