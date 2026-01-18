#[derive(Debug, Clone)]
pub struct Quote {
    pub symbol: String,
    pub price: f64,
    pub ts: i64,
}
