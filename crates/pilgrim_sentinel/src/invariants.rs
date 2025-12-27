use std::collections::HashMap;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum InvariantClass {
    Schema,
    Value,
    Transition,
    Temporal,
}

#[derive(Debug, Clone)]
pub struct InvariantSpec {
    pub id: &'static str,
    pub class: InvariantClass,
}

impl InvariantSpec {
    pub const fn new(id: &'static str, class: InvariantClass) -> Self {
        Self { id, class }
    }
}

#[derive(Debug, Default)]
pub struct InvariantRegistry {
    specs: HashMap<&'static str, InvariantSpec>,
}

impl InvariantRegistry {
    pub fn new() -> Self {
        Self {
            specs: HashMap::new(),
        }
    }

    pub fn register(&mut self, spec: InvariantSpec) {
        if self.specs.contains_key(spec.id) {
            panic!("Invariant already registered: {}", spec.id);
        }
        self.specs.insert(spec.id, spec);
    }

    pub fn get(&self, id: &str) -> Option<&InvariantSpec> {
        self.specs.get(id)
    }
}
