use anyhow::Result;
use crate::config::Config;
use crate::quote::Quote;
use std::time::{SystemTime, UNIX_EPOCH};

pub async fn get_price(cfg: &Config) -> Result<Quote> {
    // Deterministic mock price for now
    let price = cfg.mock_price.unwrap_or(101.0);

    let ts = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() as i64;

    Ok(Quote {
        symbol: cfg.symbol.clone(),
        price,
        ts,
    })
}
