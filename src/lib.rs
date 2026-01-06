#![cfg_attr(not(feature = "std"), no_std)]

#[cfg(feature = "std")]

/// Core result type for Pilgrim decisions
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum EnforcementResult {
    Allowed,
    Halted(&'static str),
}

/// Deterministic enforcement entry point
pub fn enforce(rule: bool, reason: &'static str) -> EnforcementResult {
    if rule {
        EnforcementResult::Allowed
    } else {
        EnforcementResult::Halted(reason)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn allows_when_rule_true() {
        assert_eq!(enforce(true, "ok"), EnforcementResult::Allowed);
    }

    #[test]
    fn halts_when_rule_false() {
        assert_eq!(
            enforce(false, "violation"),
            EnforcementResult::Halted("violation")
        );
    }
}
