use axum::{routing::get, Router};
use tokio::net::TcpListener;

async fn root() -> &'static str {
    "ZITE is online.

This is a sovereign access layer powered by Pilgrim Core.

Amethyst Deterministic Ltd.
More coming."
}

pub async fn run() {
    let app = Router::new().route("/", get(root));

    let addr = "127.0.0.1:3000";
    println!("Zite running on http://{}", addr);

    let listener = TcpListener::bind(addr)
        .await
        .expect("Failed to bind address");

    axum::serve(listener, app)
        .await
        .expect("Server error");
}
