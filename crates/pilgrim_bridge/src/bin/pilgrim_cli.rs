use std::io::{self, Read};

fn main() {
    let mut buf = String::new();
    io::stdin().read_to_string(&mut buf).ok();

    match pilgrim_bridge::bridge_json(&buf) {
        Ok(out) => {
            println!("{out}");
        }
        Err(e) => {
            eprintln!("{{\"ok\":false,\"error\":\"{}\"}}", e);
            std::process::exit(1);
        }
    }
}
