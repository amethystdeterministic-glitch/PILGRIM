use pilgrim_console::{ConsoleCartridge, CartridgeOutput};

//
// ================= Cognitive Drift =================
//

pub struct CognitiveDriftCartridge;

impl CognitiveDriftCartridge {
    pub fn new() -> Self {
        Self
    }
}

impl ConsoleCartridge for CognitiveDriftCartridge {
    fn id(&self) -> &'static str {
        "cognitive_drift_v1"
    }

    fn execute(&mut self, _tick: u64) -> CartridgeOutput {
        CartridgeOutput {
            message: "Cognitive drift stabilised".to_string(),
            confidence: 0.93,
        }
    }
}

//
// ================= Neuro Discordance =================
//

pub struct NeuroDiscordanceCartridge;

impl NeuroDiscordanceCartridge {
    pub fn new() -> Self {
        Self
    }
}

impl ConsoleCartridge for NeuroDiscordanceCartridge {
    fn id(&self) -> &'static str {
        "neuro_discordance_v1"
    }

    fn execute(&mut self, _tick: u64) -> CartridgeOutput {
        CartridgeOutput {
            message: "Neuro discordance evaluated".to_string(),
            confidence: 0.72,
        }
    }
}

//
// ================= Threshold Ambiguity =================
//

pub struct ThresholdAmbiguityCartridge;

impl ThresholdAmbiguityCartridge {
    pub fn new() -> Self {
        Self
    }
}

impl ConsoleCartridge for ThresholdAmbiguityCartridge {
    fn id(&self) -> &'static str {
        "threshold_ambiguity_v1"
    }

    fn execute(&mut self, _tick: u64) -> CartridgeOutput {
        CartridgeOutput {
            message: "Threshold ambiguity resolved".to_string(),
            confidence: 0.81,
        }
    }
}
