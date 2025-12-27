use std::collections::HashMap;

/// Canonical invariant classes
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum InvariantClass {
    Schema,
    Value,
    Distribution,
    Temporal,
    Transition,
}

/// A declared invariant (no execution logic)
#[derive(Debug, Clone)]
pub struct Invariant {
    pub id: &'static str,
    pub class: InvariantClass,
    pub domain: &'static str,
}

/// Deterministic registry (in-memory, explicit)
#[derive(Default)]
pub struct InvariantRegistry {
    invariants: HashMap<&'static str, Invariant>,
}

impl InvariantRegistry {
    pub fn new() -> Self {
        Self {
            invariants: HashMap::new(),
        }
    }

    /// Register a new invariant
    /// Fails closed on duplicate ID
    pub fn register(&mut self, invariant: Invariant) {
        if self.invariants.contains_key(invariant.id) {
            panic!(
                "Invariant already registered: {}",
                invariant.id
            );
        }

        self.invariants.insert(invariant.id, invariant);
    }

    /// Fetch invariant by ID
    pub fn get(&self, id: &str) -> Option<&Invariant> {
        self.invariants.get(id)
    }

    /// List all invariants for a domain
    pub fn by_domain(&self, domain: &str) -> Vec<&Invariant> {
        self.invariants
            .values()
            .filter(|inv| inv.domain == domain)
            .collect()
    }
}
