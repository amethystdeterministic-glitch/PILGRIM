use pilgrim_bridge::{verify_intent, VerifyRequest};
use tiny_http::{Header, Method, Response, Server};

fn json_header() -> Header {
    Header::from_bytes(
        &b"Content-Type"[..],
        &b"application/json; charset=utf-8"[..],
    )
    .unwrap()
}

fn main() {
    let addr = "127.0.0.1:8777";
    let server = Server::http(addr).expect("failed to bind");

    eprintln!("Pilgrim Bridge listening on http://{addr}");
    eprintln!("Routes:");
    eprintln!("  GET  /health");
    eprintln!("  POST /verify");

    for mut request in server.incoming_requests() {
        let method = request.method().clone();
        let url = request.url().to_string();

        if method == Method::Get && url == "/health" {
            let body = r#"{"ok":true,"service":"pilgrim_bridge","version":"0.1.0"}"#;
            let resp = Response::from_string(body).with_header(json_header());
            let _ = request.respond(resp);
            continue;
        }

        if method == Method::Post && url == "/verify" {
            let mut body = String::new();
            if let Err(_) = request.as_reader().read_to_string(&mut body) {
                let resp = Response::from_string(
                    r#"{"ok":false,"error":"failed to read body"}"#,
                )
                .with_header(json_header())
                .with_status_code(400);
                let _ = request.respond(resp);
                continue;
            }

            match serde_json::from_str::<VerifyRequest>(&body) {
                Ok(req) => {
                    let result = verify_intent(req);
                    let status = if result.ok { 200 } else { 422 };
                    let out = serde_json::to_string_pretty(&result).unwrap();
                    let resp = Response::from_string(out)
                        .with_header(json_header())
                        .with_status_code(status);
                    let _ = request.respond(resp);
                }
                Err(e) => {
                    let resp = Response::from_string(format!(
                        r#"{{"ok":false,"error":"invalid json: {}"}}"#,
                        e
                    ))
                    .with_header(json_header())
                    .with_status_code(400);
                    let _ = request.respond(resp);
                }
            }
            continue;
        }

        let resp = Response::from_string(r#"{"ok":false,"error":"not found"}"#)
            .with_header(json_header())
            .with_status_code(404);
        let _ = request.respond(resp);
    }
}

