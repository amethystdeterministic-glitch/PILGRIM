pub mod contracts;

use crate::piano::interface::{PianoEngine, PianoFrame};
use contracts::{ContractStage, ContractState};

pub struct Console<E: PianoEngine> {
    piano: E,
    contract: ContractState,
}

impl<E: PianoEngine> Console<E> {
    pub fn new(piano: E) -> Self {
        Self {
            piano,
            contract: ContractState::new(),
        }
    }

    pub fn ingest_frame(&mut self, frame: PianoFrame) {
        self.piano.ingest(frame);
    }

    pub fn advance(&mut self, next: ContractStage) {
        self.contract.advance(next);
    }

    pub fn stage(&self) -> ContractStage {
        self.contract.stage()
    }

    pub fn is_complete(&self) -> bool {
        self.contract.is_complete()
    }

    pub fn score(&self) -> f64 {
        self.piano.score()
    }
}
