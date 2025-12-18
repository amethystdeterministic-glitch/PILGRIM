use crate::{Constraints, ConstraintsError, Receipt, Trace};

#[derive(Debug, Clone)]
pub struct PilgrimEngine {
    constraints: Constraints,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum EngineError {
    Constraints(ConstraintsError),
    // Extend later: Storage, Bridge, Crypto, etc.
}

impl From<ConstraintsError> for EngineError {
    fn from(e: ConstraintsError) -> Self {
        EngineError::Constraints(e)
    }
}

#[derive(Debug, Clone)]
pub struct RunResult {
    pub receipt: Receipt,
    pub final_trace_hash: String,
    pub steps: u64,
}

impl PilgrimEngine {
    pub fn new(constraints: Constraints) -> Self {
        Self { constraints }
    }

    pub fn constraints(&self) -> &Constraints {
        &self.constraints
    }

    /// Deterministic run: same inputs => same receipt + trace hash.
    ///
    /// NOTE: Runtime limits are enforced via *provided* elapsed_ms (deterministic).
    /// We do NOT call wall-clock time inside the deterministic engine.
    pub fn run(
        &self,
        run_id: &str,
        intent_statement: &str,
        input: &[u8],
        simulated_elapsed_ms: u64,
    ) -> Result<RunResult, EngineError> {
        // Enforce runtime constraint deterministically
        self.constraints.assert_runtime_allowed(simulated_elapsed_ms)?;

        let mut trace = Trace::new(run_id, intent_statement);

        // Step 0: ingest input
        self.constraints.assert_step_allowed(0)?;
        trace.push_step("ingest_input", input);

        // Step 1: deterministic transform (placeholder, but deterministic)
        self.constraints.assert_step_allowed(1)?;
        let transformed = deterministic_transform(input);
        trace.push_step("transform", &transformed);

        // Step 2: finalize
        self.constraints.assert_step_allowed(2)?;
        let final_hash = trace.finalize_hash();

        let receipt = Receipt::new(run_id, intent_statement, &final_hash, trace.steps_len() as u64);

        Ok(RunResult {
            receipt,
            final_trace_hash: final_hash,
            steps: trace.steps_len() as u64,
        })
    }
}

fn deterministic_transform(input: &[u8]) -> Vec<u8> {
    // Simple deterministic transform: XOR each byte with 0x5A and append length.
    let mut out = Vec::with_capacity(input.len() + 8);
    for b in input {
        out.push(b ^ 0x5A);
    }
    out.extend_from_slice(&(input.len() as u64).to_le_bytes());
    out
}
