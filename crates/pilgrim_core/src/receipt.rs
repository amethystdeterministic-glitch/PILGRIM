use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct StepReceipt {
    pub step_index: u64,
    pub step_name: String,
    pub input_hash: String,
    pub output_hash: String,
    pub trace_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct RunReceipt {
    pub run_id: String,
    pub intent_checksum: String,
    pub final_trace_hash: String,
    pub steps: Vec<StepReceipt>,
}
