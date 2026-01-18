#[derive(Debug)]
pub struct RiskState {
    cash: f64,
}

impl RiskState {
    pub fn new(cash: f64) -> Self {
        Self { cash }
    }

    pub fn route_state(&self) -> &'static str {
        "ALLOW"
    }

    pub fn d_norm(&self) -> f64 {
        0.0
    }
}
