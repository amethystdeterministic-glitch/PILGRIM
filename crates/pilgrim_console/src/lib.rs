use pilgrim_identity::Identity;
use pilgrim_mandate::Mandate;

#[derive(Debug, Clone)]
pub struct CartridgeOutput {
    pub message: String,
    pub confidence: f32,
}

pub trait ConsoleCartridge {
    fn id(&self) -> &'static str;
    fn execute(&mut self, tick: u64) -> CartridgeOutput;
}

pub struct Console {
    identity: Identity,
    mandate: Mandate,
}

impl Console {
    pub fn new(identity: Identity, mandate: Mandate) -> Self {
        Self { identity, mandate }
    }

    pub fn run<C>(
        &mut self,
        cartridge: &mut C,
        tick: u64,
    ) -> Result<CartridgeOutput, Box<dyn std::error::Error>>
    where
        C: ConsoleCartridge,
    {
        let subject = &self.identity;

        if !self.mandate.allows(subject, cartridge.id()) {
            return Err(format!(
                "Mandate violation: {} may not execute {}",
                subject.subject_id,
                cartridge.id()
            )
            .into());
        }

        Ok(cartridge.execute(tick))
    }
}
