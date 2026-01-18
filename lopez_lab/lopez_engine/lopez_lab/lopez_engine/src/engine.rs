use anyhow::Result;
use crate::config::Config;
use crate::ledger::Ledger;
use crate::price::get_price;

pub async fn run(cfg: &Config) -> Result<()> {
    let mut ledger = Ledger::load_or_init(cfg.start_cash_gbp)?;

    println!("Lopez Engine online.");
    println!("symbol={}", cfg.symbol);
    println!("cash_gbp={:.4}", ledger.cash_gbp);
    println!("trades={}", ledger.trades);

    let quote = get_price(cfg).await?;

    if ledger.can_trade(cfg.cooldown_secs, quote.ts) {
        let spend = ledger.cash_gbp * cfg.max_fraction;
        println!(
            "[INTENT] BUY £{:.4} @ {:.4} (ts={})",
            spend, quote.price, quote.ts
        );

        if cfg.dry_run {
            println!("[EXECUTION] dry-run");
        } else {
            ledger.apply_buy(spend, quote.ts)?;
            println!("[FILL] executed");
        }
    } else {
        println!("[INTENT] none (cooldown active)");
    }

    Ok(())
}
