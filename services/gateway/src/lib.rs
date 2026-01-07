use axum::{
    routing::get,
    Router,
    response::IntoResponse,
    http::StatusCode,
};
use reqwest::Client;
use tokio::net::TcpListener;

pub async fn run() {
    let app = Router::new()
        .route("/", get(root))
        .route("/status", get(proxy_status))
        .route("/status-json", get(proxy_status_json));

    let listener = TcpListener::bind("0.0.0.0:4000")
        .await
        .expect("failed to bind gateway");

    println!("GATEWAY running on http://0.0.0.0:4000");

    axum::serve(listener, app)
        .await
        .expect("gateway error");
}

async fn root() -> impl IntoResponse {
    (
        StatusCode::OK,
        "Amethyst Gateway\nDeterministic Edge\n",
    )
}

async fn proxy_status() -> impl IntoResponse {
    let client = Client::new();

    let response = client
        .get("http://127.0.0.1:3000/status")
        .send()
        .await;

    let body = match response {
        Ok(r) => r.text().await.unwrap_or_else(|_| "ZITE unreadable".into()),
        Err(_) => "ZITE unavailable".into(),
    };

    (StatusCode::OK, body)
}

async fn proxy_status_json() -> impl IntoResponse {
    let client = Client::new();

    let response = client
        .get("http://127.0.0.1:3000/status-json")
        .send()
        .await;

    let body = match response {
        Ok(r) => r.text().await.unwrap_or_else(|_| "{}".into()),
        Err(_) => "{}".into(),
    };

    (StatusCode::OK, body)
}




