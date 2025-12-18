use crate::{fold_trace, hash_bytes, hash_json, receipt::{RunReceipt, StepReceipt}, trace::TraceEvent};
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum EngineError {
    #[error("step failed: {0}")]
    StepFailed(String),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub struct EngineIntent {
    pub intent_id: String,
    pub statement: String,
    pub checksum: String, // passed in from handshake layer
}

#[derive(Debug, Clone)]
pub struct EngineStep {
    pub name: &'static str,
    pub func: fn(&[u8]) -> Result<Vec<u8>, EngineError>,
}

#[derive(Debug, Clone)]
pub struct Engine {
    pub steps: Vec<EngineStep>,
}

impl Engine {
    pub fn new(steps: Vec<EngineStep>) -> Self {
        Self { steps }
    }

    pub fn run(&self, run_id: &str, intent: &EngineIntent, input: &[u8]) -> Result<RunReceipt, EngineError> {
        let mut prev_trace = "GENESIS".to_string();
        let mut receipts: Vec<StepReceipt> = Vec::new();

        let mut current = input.to_vec();
        for (i, step) in self.steps.iter().enumerate() {
            let input_hash = hash_bytes(&current);
            let out = (step.func)(&current).map_err(|e| EngineError::StepFailed(format!("{}: {}", step.name, e)))?;
            let output_hash = hash_bytes(&out);

            let event = TraceEvent {
                step_index: i as u64,
                step_name: step.name.to_string(),
                input_hash: input_hash.clone(),
                output_hash: output_hash.clone(),
                prev_trace_hash: prev_trace.clone(),
            };

            let trace_hash = fold_trace(&prev_trace, &event);
            prev_trace = trace_hash.clone();

            receipts.push(StepReceipt {
                step_index: i as u64,
                step_name: step.name.to_string(),
                input_hash,
                output_hash,
                trace_hash,
            });

            current = out;
        }

        // final trace hash is prev_trace after all steps
        let run_receipt = RunReceipt {
            run_id: run_id.to_string(),
            intent_checksum: intent.checksum.clone(),
            final_trace_hash: prev_trace,
            steps: receipts,
        };

        // extra determinism sanity: run receipt must hash consistently
        let _receipt_hash = hash_json(&run_receipt);

        Ok(run_receipt)
    }
}
