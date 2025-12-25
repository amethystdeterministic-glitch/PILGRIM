use pilgrim_core::advance;

#[test]
fn engine_advances_deterministically() {
    let a = advance("test-event");
    let b = advance("test-event");
    assert_ne!(a, b);
}
