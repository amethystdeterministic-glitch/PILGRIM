use axum::{
    routing::get,
    Router,
    response::IntoResponse,
    http::StatusCode,
    Json,
};

use serde_json::json;
use tokio::net::TcpListener;

use pilgrim_core::identity::IdentityFingerprint;

pub async fn run() {
    let app = Router::new()
        .route("/", get(root))
        .route("/status", get(status))
        .route("/status-json", get(status_json));

let listener = TcpListener::bind("0.0.0.0:3000")
        .await
        .expect("failed to bind address");

    println!("ZITE running on http://127.0.0.1:3000");

    axum::serve(listener, app)
        .await
        .expect("server error");
}

async fn root() -> impl IntoResponse {
    (
        StatusCode::OK,
        r#"ZITE — Sovereign Access Layer

Status: ONLINE
Runtime: Pilgrim Core
Mode: Deterministic Enforcement

This endpoint is intentionally minimal.
No tracking. No cookies. No inference.

You are interacting with a live access surface,
not a website.

Amethyst Deterministic Ltd."#,
    )
}

async fn status() -> impl IntoResponse {
    (StatusCode::OK, "ONLINE")
}

async fn status_json() -> impl IntoResponse {
    let id = IdentityFingerprint::amethyst();

    Json(json!({
        "authority": id.authority,
        "system": id.system,
        "version": id.version,
        "deterministic": id.deterministic,
        "state": "online"
    }))
}
