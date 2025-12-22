use std::collections::HashMap;

/// Piano Key States
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum PianoKeyState {
    Locked,
    Ready,
    Completed,
}

/// Canonical Piano Keys (v1.1)
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PianoKey {
    Init,
    Validate,
    Build,
    Review,
    Lock,
    Export,
}

/// Piano Engine Contract
pub trait PianoEngine {
    fn press(&mut self, key: PianoKey) -> Result<(), String>;
    fn state(&self, key: PianoKey) -> PianoKeyState;
    fn current_key(&self) -> PianoKey;
}

/// Mock Piano Engine (Deterministic)
pub struct MockPianoEngine {
    order: Vec<PianoKey>,
    cursor: usize,
    states: HashMap<PianoKey, PianoKeyState>,
}

impl Default for MockPianoEngine {
    fn default() -> Self {
        let order = vec![
            PianoKey::Init,
            PianoKey::Validate,
            PianoKey::Build,
            PianoKey::Review,
            PianoKey::Lock,
            PianoKey::Export,
        ];

        let mut states = HashMap::new();
        for key in &order {
            states.insert(*key, PianoKeyState::Locked);
        }

        states.insert(PianoKey::Init, PianoKeyState::Ready);

        Self {
            order,
            cursor: 0,
            states,
        }
    }
}

impl PianoEngine for MockPianoEngine {
    fn press(&mut self, key: PianoKey) -> Result<(), String> {
        let expected = self.order[self.cursor];

        if key != expected {
            return Err(format!(
                "Invalid key order. Expected {:?}, got {:?}",
                expected, key
            ));
        }

        self.states.insert(key, PianoKeyState::Completed);
        self.cursor += 1;

        if let Some(next) = self.order.get(self.cursor) {
            self.states.insert(*next, PianoKeyState::Ready);
        }

        Ok(())
    }

    fn state(&self, key: PianoKey) -> PianoKeyState {
        *self.states.get(&key).unwrap()
    }

    fn current_key(&self) -> PianoKey {
        self.order[self.cursor]
    }
}

/// Console Demo
fn main() {
    let mut engine = MockPianoEngine::default();

    println!("PILGRIM PIANO LAYER v1.1");
    println!("------------------------");

    let sequence = [
        PianoKey::Init,
        PianoKey::Validate,
        PianoKey::Build,
        PianoKey::Review,
        PianoKey::Lock,
        PianoKey::Export,
    ];

    for key in sequence {
        println!("Pressing key: {:?}", key);
        engine.press(key).expect("Piano key failed");

        for k in &sequence {
            println!("  {:?}: {:?}", k, engine.state(*k));
        }

        println!("------------------------");
    }

    println!("Piano sequence completed successfully.");
}
