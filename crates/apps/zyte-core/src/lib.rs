use std::collections::HashSet;

/// Deterministic, policy-gated request
#[derive(Debug, Clone)]
pub struct ZyteRequest {
    url: String,
    fingerprint: String,
}

impl ZyteRequest {
    /// Create a new Zyte request bound to an identity fingerprint
    pub fn new(url: &str, fingerprint: &str) -> Self {
        Self {
            url: url.to_string(),
            fingerprint: fingerprint.to_string(),
        }
    }

    /// Request URL
    pub fn url(&self) -> &str {
        &self.url
    }

    /// Identity fingerprint attached to request
    pub fn fingerprint(&self) -> &str {
        &self.fingerprint
    }
}

/// Simple deterministic allowlist (placeholder for policy engine)
pub fn allow_domain(domain: &str) -> bool {
    let mut allowed = HashSet::new();
    allowed.insert("example.com");
    allowed.insert("amethyst.local");

    allowed.contains(domain)
}
