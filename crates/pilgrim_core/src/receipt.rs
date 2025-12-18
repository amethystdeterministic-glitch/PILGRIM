#[derive(Debug, Clone)]
pub struct Receipt {
    pub run_id: String,
    pub intent_statement: String,
    pub final_trace_hash: String,
    pub steps: u64,
}

impl Receipt {
    pub fn new(run_id: &str, intent_statement: &str, final_trace_hash: &str, steps: u64) -> Self {
        Self {
            run_id: run_id.to_string(),
            intent_statement: intent_statement.to_string(),
            final_trace_hash: final_trace_hash.to_string(),
            steps,
        }
    }
}
