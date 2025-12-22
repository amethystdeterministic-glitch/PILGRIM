use serde_json::json;
use tiny_http::{Header, Response, Server};

use pilgrim_core::constraints::Constraints;
use pilgrim_core::engine::PilgrimEngine;

fn main() {
    let server = Server::http("127.0.0.1:8080").expect("Failed to bind HTTP server");

    println!("🟣 Pilgrim Bridge listening on http://127.0.0.1:8080");

    let engine = PilgrimEngine::new(Constraints::default());

    let content_type =
        Header::from_bytes(&b"Content-Type"[..], &b"application/json"[..]).expect("Invalid header");

    for mut request in server.incoming_requests() {
        let mut body = Vec::new();
        request
            .as_reader()
            .read_to_end(&mut body)
            .expect("Failed to read request body");

        let run = engine
            .run(
                "http-run",
                "deterministic-http",
                &body,
                0, // simulated elapsed ms
            )
            .expect("Engine run failed");

        let response_body = json!({
            "ok": true,
            "receipt": {
                "final_trace_hash": run.final_trace_hash,
                "steps": run.steps
            }
        })
        .to_string();

        let response = Response::from_string(response_body).with_header(content_type.clone());

        let _ = request.respond(response);
    }
}
