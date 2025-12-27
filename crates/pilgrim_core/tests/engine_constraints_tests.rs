use pilgrim_core::contract::{StepAdvance, ContractVerdict};
use pilgrim_core::contract::TransitionContract;

#[test]
fn advance_requires_state_change() {
    let c = StepAdvance;

    assert_eq!(
        c.evaluate_with(1, 2),
        ContractVerdict::Pass
    );

    assert_eq!(
        c.evaluate_with(2, 2),
        ContractVerdict::Fail("engine advance produced no state change".into())
    );
}
