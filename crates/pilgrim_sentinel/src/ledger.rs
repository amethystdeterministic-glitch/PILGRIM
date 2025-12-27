#[derive(Debug, Clone)]
pub struct DriftEvent {
    pub domain: &'static str,
    pub invariant: &'static str,
    pub class: &'static str,
    pub before_hash: &'static str,
    pub after_hash: &'static str,
}

#[derive(Default)]
pub struct DriftLedger {
    pub events: Vec<DriftEvent>,
}

impl DriftLedger {
    pub fn new() -> Self {
        Self { events: Vec::new() }
    }

    pub fn record(
        &mut self,
        domain: &'static str,
        invariant: &'static str,
        class: &'static str,
        before_hash: &'static str,
        after_hash: &'static str,
    ) -> DriftEvent {
        let event = DriftEvent {
            domain,
            invariant,
            class,
            before_hash,
            after_hash,
        };

        self.events.push(event.clone());
        event
    }
}
