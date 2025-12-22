#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ContractStage {
    Init,
    Validate,
    Build,
    Review,
    Lock,
    Export,
}

#[derive(Debug)]
pub struct ContractState {
    stage: ContractStage,
}

impl ContractState {
    pub fn new() -> Self {
        Self {
            stage: ContractStage::Init,
        }
    }

    pub fn stage(&self) -> ContractStage {
        self.stage
    }

    pub fn is_complete(&self) -> bool {
        self.stage == ContractStage::Export
    }

    pub fn advance(&mut self, next: ContractStage) {
        self.stage = next;
    }
}
