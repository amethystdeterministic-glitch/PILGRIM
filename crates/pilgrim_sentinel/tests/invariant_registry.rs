use pilgrim_sentinel::{InvariantRegistry, InvariantSpec, InvariantClass};

#[test]
fn invariant_registry_registers_and_fetches() {
    let mut registry = InvariantRegistry::new();

    registry.register(
        InvariantSpec::new(
            "contract.state.transition",
            InvariantClass::Transition,
        )
    );

    let inv = registry
        .get("contract.state.transition")
        .expect("invariant missing");

    assert_eq!(inv.class, InvariantClass::Transition);
}

#[test]
#[should_panic]
fn invariant_registry_rejects_duplicates() {
    let mut registry = InvariantRegistry::new();
registry.register(
    InvariantSpec::new("dup", InvariantClass::Schema)
);
registry.register(
    InvariantSpec::new("dup", InvariantClass::Schema)
); // must panic

}
