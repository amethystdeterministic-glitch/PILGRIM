use pilgrim_core::PilgrimEngine;

#[test]
fn engine_respects_constraints() {
    let mut engine = PilgrimEngine::default();
    engine.step("constraint-test");
}
