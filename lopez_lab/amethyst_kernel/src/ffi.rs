//! C-ABI wrapper for the Quartz kernel (v8.2.2)

use crate::core::{route, KernelInputs, KernelOutput};

#[no_mangle]
pub extern "C" fn amethyst_route(inputs: *const KernelInputs) -> KernelOutput {
    // Fail-closed: null pointer => FAIL_SAFE
    if inputs.is_null() {
        return KernelOutput {
            route: crate::core::RouteState::FailSafe,
            d_norm: 1.0,
        };
    }

    // Safety: caller must provide a valid KernelInputs pointer
    let inputs_ref = unsafe { &*inputs };
    route(inputs_ref)
}
