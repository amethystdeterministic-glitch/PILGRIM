use pilgrim_console::Console;
use pilgrim_gift::{
    CognitiveDriftCartridge,
    NeuroDiscordanceCartridge,
    ThresholdAmbiguityCartridge,
};
use pilgrim_identity::Identity;
use pilgrim_mandate::{Mandate, MandateRule};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("🎹 PILGRIM CONSOLE DEMO — DETERMINISTIC");

    // Identity (Stub C)
    let identity = Identity::new(
        "ernesto_lopez",
        b"demo-pubkey-bytes",
    )?;

    // Mandate — explicit allow
    let mandate = Mandate::new(vec![
        MandateRule {
            subject_id: "ernesto_lopez".into(),
            cartridge_id: "cognitive_drift_v1".into(),
        },
        MandateRule {
            subject_id: "ernesto_lopez".into(),
            cartridge_id: "neuro_discordance_v1".into(),
        },
        MandateRule {
            subject_id: "ernesto_lopez".into(),
            cartridge_id: "threshold_ambiguity_v1".into(),
        },
    ]);

    let mut console = Console::new(identity, mandate);

    // --- Cognitive Drift
    let mut drift = CognitiveDriftCartridge::new();
    let out = console.run(&mut drift, 10)?;
    println!("🧠 {}", out.message);

    // --- Neuro Discordance
    let mut discord = NeuroDiscordanceCartridge::new();
    let out = console.run(&mut discord, 30)?;
    println!("🧬 {}", out.message);

    // --- Threshold Ambiguity
    let mut threshold = ThresholdAmbiguityCartridge::new();
    let out = console.run(&mut threshold, 49)?;
    println!("🚧 {}", out.message);

    let out = console.run(&mut threshold, 50)?;
    println!("🔒 {}", out.message);

    println!("✅ DEMO COMPLETE — REPRODUCIBLE");

    Ok(())
}
