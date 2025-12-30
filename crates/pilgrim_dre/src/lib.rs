/// Pilgrim D.R.E. — Deterministic Runtime Enforcement
///
/// This function is intentionally brutal.
/// If enforcement fails, execution halts immediately.
/// No logging. No retry. No interpretation.

pub fn enforce(allowed: bool) -> ! {
    if allowed {
        // This should never be called with `true`
        // If it is, that's a design error.
        panic!("D.R.E. misuse: enforce(true) is invalid");
    }

    // Deterministic hard stop
    std::process::abort();
}
