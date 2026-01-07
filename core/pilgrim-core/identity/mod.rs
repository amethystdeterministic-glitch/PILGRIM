#[derive(Clone)]
pub struct IdentityFingerprint {
    pub authority: &'static str,
    pub system: &'static str,
    pub version: &'static str,
    pub deterministic: bool,
}

impl IdentityFingerprint {
    pub const fn amethyst() -> Self {
        Self {
            authority: "Amethyst Deterministic Ltd",
            system: "ZITE",
            version: "v1.0.0",
            deterministic: true,
        }
    }
}
