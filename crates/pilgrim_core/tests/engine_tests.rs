use pilgrim_core::PilgrimEngine;

#[test]
fn engine_advances_deterministically() {
    let mut engine = PilgrimEngine::default();
    engine.step("engine-test");
}
