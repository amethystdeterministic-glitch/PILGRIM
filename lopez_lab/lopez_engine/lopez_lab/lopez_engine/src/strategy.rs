use crate::{config::Config, ledger::Ledger, quote::Quote};

#[derive(Debug, Clone)]
pub enum Intent {
    Buy {
        symbol: String,
        notional_gbp: f64,
        at_price: f64,
        ts: i64,
    },
    None {
        reason: String,
        ts: i64,
    },
}

fn floor_to_pence(x: f64) -> f64 {
    (x * 100.0).floor() / 100.0
}

pub fn decide(cfg: &Config, ledger: &Ledger, quote: &Quote) -> Intent {
    // Deterministic guardrails (no opinions, just rules).
    if ledger.trades > 0 {
        return Intent::None {
            reason: "already traded".to_string(),
            ts: quote.ts,
        };
    }

    if ledger.cash_gbp <= 0.0 {
        return Intent::None {
            reason: "no cash".to_string(),
            ts: quote.ts,
        };
    }

    let mut spend = ledger.cash_gbp * cfg.max_fraction;

    // Deterministic minimum to avoid noise trades.
    // (Still non-opinionated: just a floor so the engine behaves.)
    if spend < 0.01 {
        return Intent::None {
            reason: "below min notional".to_string(),
            ts: quote.ts,
        };
    }

    spend = floor_to_pence(spend);

    if spend <= 0.0 {
        return Intent::None {
            reason: "computed spend <= 0".to_string(),
            ts: quote.ts,
        };
    }

    Intent::Buy {
        symbol: quote.symbol.clone(),
        notional_gbp: spend,
        at_price: quote.price,
        ts: quote.ts,
    }
}
