use serde::{Serialize, Deserialize};

/// Piano Layer Contract
/// This defines how external orchestration layers
/// interact with Pilgrim deterministically.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PianoRequest {
    pub domain: String,          // e.g. "cancer_research"
    pub dataset_id: String,      // e.g. public dataset reference
    pub intent: String,          // e.g. "run_trial", "compare_models"
    pub parameters: serde_json::Value,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PianoResponse {
    pub execution_id: String,
    pub status: PianoStatus,
    pub result: serde_json::Value,
    pub audit_hash: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PianoStatus {
    Accepted,
    Executing,
    Completed,
    Rejected,
}

/// Piano Interface Trait
/// Any orchestration layer (UI, API, partner system)
/// must implement against this — not against core logic.
pub trait PianoLayer {
    fn submit(&self, request: PianoRequest) -> PianoResponse;
}
