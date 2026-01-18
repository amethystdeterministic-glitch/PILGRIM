use anyhow::Result;

#[derive(Debug)]
pub struct Broker;

impl Broker {
    pub fn new() -> Result<Self> {
        Ok(Self)
    }

    pub fn submit_buy(&self, _symbol: &str, _spend_gbp: f64, _price: f64) -> Result<()> {
        // PAPER MODE: execution already handled by Ledger
        Ok(())
    }
}
