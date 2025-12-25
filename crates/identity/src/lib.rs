#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PrincipalRole {
    Root,
    Operator,
    Cartridge,
    Guest,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Principal {
    pub id: String,
    pub role: PrincipalRole,
}

#[derive(Debug, Clone)]
pub struct IdentityVerifier;

#[derive(Debug, Clone)]
pub enum IdentityError {
    EmptyBlob,
    InvalidUtf8,
    Malformed,
}

impl IdentityVerifier {
    pub fn new() -> Self {
        Self
    }

    /// v0: super-simple verifier
    ///
    /// Accepts identity_blob as UTF-8:
    ///   "id:<SOME_ID>;role:<Root|Operator|Cartridge|Guest>"
    ///
    /// Examples:
    ///   "id:acme-user-01;role:Operator"
    ///   "id:cartridge-x;role:Cartridge"
    pub fn verify(&self, identity_blob: &[u8]) -> Result<Principal, IdentityError> {
        if identity_blob.is_empty() {
            return Err(IdentityError::EmptyBlob);
        }

        let s = core::str::from_utf8(identity_blob).map_err(|_| IdentityError::InvalidUtf8)?;

        let mut id: Option<String> = None;
        let mut role: Option<PrincipalRole> = None;

        for part in s.split(';') {
            let part = part.trim();
            if let Some(rest) = part.strip_prefix("id:") {
                let v = rest.trim();
                if !v.is_empty() {
                    id = Some(v.to_string());
                }
            } else if let Some(rest) = part.strip_prefix("role:") {
                let v = rest.trim();
                role = Some(match v {
                    "Root" => PrincipalRole::Root,
                    "Operator" => PrincipalRole::Operator,
                    "Cartridge" => PrincipalRole::Cartridge,
                    "Guest" => PrincipalRole::Guest,
                    _ => return Err(IdentityError::Malformed),
                });
            }
        }

        let id = id.ok_or(IdentityError::Malformed)?;
        let role = role.unwrap_or(PrincipalRole::Guest);

        Ok(Principal { id, role })
    }
}
