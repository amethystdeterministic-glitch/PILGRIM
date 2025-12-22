use crate::piano::interface::PianoFrame;

#[derive(Debug, Clone)]
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
        self.state = match (self.state.clone(), frame.key) {
            (ContractState::Init, 0) => ContractState::Validate,
            (ContractState::Validate, 1) => ContractState::Build,
            (ContractState::Build, 2) => ContractState::Review,
            (ContractState::Review, 3) => ContractState::Lock,
            (ContractState::Lock, 4) => ContractState::Export,
            (ContractState::Export, 5) => ContractState::Complete,
            (s, _) => s,
        };
    }

    pub fn state(&self) -> &ContractState {
        &self.state
    }
}
