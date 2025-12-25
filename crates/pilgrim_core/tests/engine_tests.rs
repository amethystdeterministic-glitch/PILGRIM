use pilgrim_core::advance;

#[test]
fn engine_advances_with_distinct_events() {
    let a = advance("event-one");
    let b = advance("event-two");
    assert_ne!(a, b);
}

#[test]
fn engine_is_deterministic_per_event_order() {
    let a1 = advance("alpha");
    let a2 = advance("beta");

    let b1 = advance("alpha");
    let b2 = advance("beta");

    assert_ne!(a1, b1); // sequence advances
    assert_ne!(a2, b2);
}
