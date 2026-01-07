pub struct IdentityFingerprint {
    pub authority: &'static str,
    pub system: &'static str,
    pub version: &'static str,
}

impl IdentityFingerprint {
    pub const fn amethyst() -> Self {
        Self {
            authority: "Amethyst Deterministic Ltd",
            system: "ZITE",
            version: "v1.0",
        }
    }
}
