use once_cell::sync::Lazy;
use piano::DeterministicSequence;
use std::sync::Mutex;

/// Global deterministic sequence for Pilgrim Core
static CORE_SEQUENCE: Lazy<Mutex<DeterministicSequence>> = Lazy::new(|| {
    // Deterministic seed derived from stable bytes
    let seed: u64 = {
        let bytes = b"pilgrim-core-sequence";
        let mut acc = 0u64;
        for b in bytes {
            acc = acc.wrapping_mul(31).wrapping_add(*b as u64);
        }
        acc
    };

    Mutex::new(DeterministicSequence::new(seed))
});

/// Advance the deterministic core using an event string
pub fn advance(event: &str) -> u64 {
    let mut seq = CORE_SEQUENCE.lock().expect("deterministic lock poisoned");

    // Event-conditioned burn-in
    let mut mix = 0u64;
    for b in event.as_bytes() {
        mix = mix.wrapping_mul(131).wrapping_add(*b as u64);
    }

    for _ in 0..(mix % 7) {
        seq.next();
    }

    seq.next()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deterministic_progression() {
        let a = advance("alpha");
        let b = advance("alpha");
        assert_ne!(a, b);
    }
}
