use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Config {
    pub symbol: String,
    pub poll_secs: u64,
    pub max_fraction: f64,
    pub dry_run: bool,
    pub start_cash_gbp: f64,
    pub cooldown_secs: i64,
    pub mock_price: Option<f64>,
}

impl Config {
    pub fn load() -> Self {
        Self {
            symbol: "AAPL".to_string(),
            poll_secs: 10,
            max_fraction: 0.65,
            dry_run: false,
            start_cash_gbp: 0.35,
            cooldown_secs: 60, // ← 1 minute cooldown
            mock_price: Some(101.0),
        }
    }
}
