mod generator;

fn main() {
    // Pilgrim gate — Forge only runs if core allows it
    pilgrim_core::allow_forge();

    println!("[FORGE] Pilgrim core online");

    match generator::generate_amethyst_demo() {
        Ok(_) => {
            println!("[FORGE] Project generated");
        }
        Err(e) => {
            eprintln!("[FORGE] Generation failed: {}", e);
            std::process::exit(1);
        }
    }
}
