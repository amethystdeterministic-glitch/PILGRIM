use anyhow::{Result, anyhow};
use serde::{Serialize, Deserialize};
use std::fs;

#[derive(Debug, Serialize, Deserialize)]
pub struct Ledger {
    pub cash_gbp: f64,
    pub trades: u64,
    pub last_trade_ts: Option<i64>,
}

impl Ledger {
    pub fn load_or_init(start_cash: f64) -> Result<Self> {
        if let Ok(s) = fs::read_to_string("ledger.json") {
            Ok(serde_json::from_str(&s)?)
        } else {
            Ok(Self {
                cash_gbp: start_cash,
                trades: 0,
                last_trade_ts: None,
            })
        }
    }

    pub fn save(&self) -> Result<()> {
        fs::write("ledger.json", serde_json::to_string_pretty(self)?)?;
        Ok(())
    }

    pub fn can_trade(&self, cooldown_secs: i64, now: i64) -> bool {
        match self.last_trade_ts {
            None => true,
            Some(ts) => now - ts >= cooldown_secs,
        }
    }

    pub fn apply_buy(&mut self, spend: f64, ts: i64) -> Result<()> {
        if self.cash_gbp < spend {
            return Err(anyhow!("insufficient cash"));
        }
        self.cash_gbp -= spend;
        self.trades += 1;
        self.last_trade_ts = Some(ts);
        self.save()?;
        Ok(())
    }
}
