use crate::piano::interface::PianoFrame;
use pilgrim_sentinel::Sentinel;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum ContractState {
    Init,
    Validate,
    Build,
    Review,
    Lock,
    Export,
    Complete,
}

pub struct PianoContract {
    state: ContractState,
}

impl PianoContract {
    pub fn new() -> Self {
        Self {
            state: ContractState::Init,
        }
    }

    pub fn apply_frame(&mut self, frame: &PianoFrame) {
        // SENTINEL: capture deterministic pre-state fingerprint
        let before_hash = Sentinel::before(
            &self.state,
            "pilgrim_core::console::contract::PianoContract::apply_frame",
        );

        // CONTRACT TRANSITION (CANONICAL)
        let next_state = match (self.state.clone(), frame.key) {
            (ContractState::Init, 0) => ContractState::Validate,
            (ContractState::Validate, 1) => ContractState::Build,
            (ContractState::Build, 2) => ContractState::Review,
            (ContractState::Review, 3) => ContractState::Lock,
            (ContractState::Lock, 4) => ContractState::Export,
            (ContractState::Export, 5) => ContractState::Complete,
            (s, _) => s,
        };

        // SENTINEL: enforce deterministic transition integrity
        if let Err(_drift) = Sentinel::after(
            &before_hash,
            &next_state,
            "pilgrim_core::console::contract::PianoContract::apply_frame",
        ) {
            eprintln!("PILGRIM SENTINEL DRIFT RECORDED");
            std::process::abort();
        }

        // COMMIT STATE (ONLY AFTER SENTINEL PASS)
        self.state = next_state;
    }

    pub fn state(&self) -> &ContractState {
        &self.state
    }
}
