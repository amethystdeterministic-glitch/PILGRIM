use ghostpass_core::GhostPassIdentity;
use zyte_core::ZyteEngine;

pub struct AmethystRuntime {
    pub ghostpass: GhostPassIdentity,
    pub zyte: ZyteEngine,
}

impl AmethystRuntime {
    pub fn initialise(policy: &[u8]) -> Self {
        let ghostpass = GhostPassIdentity::from_policy(policy);
        let zyte = ZyteEngine::from_policy(policy);

        Self { ghostpass, zyte }
    }
}
