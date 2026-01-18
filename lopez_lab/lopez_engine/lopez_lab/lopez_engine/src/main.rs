use anyhow::Result;
use tokio::time::{sleep, Duration};

mod broker;
mod config;
mod engine;
mod ledger;
mod price;
mod quote;

use config::Config;

#[tokio::main]
async fn main() -> Result<()> {
    let cfg = Config::load();

    loop {
        if let Err(e) = engine::run(&cfg).await {
            eprintln!("[ENGINE ERROR] {e}");
        }
        sleep(Duration::from_secs(cfg.poll_secs)).await;
    }
}
