use pilgrim_core::{Engine, EngineIntent, EngineStep};

fn step_upper(input: &[u8]) -> Result<Vec<u8>, pilgrim_core::EngineError> {
    let s = String::from_utf8_lossy(input).to_string();
    Ok(s.to_uppercase().into_bytes())
}

fn step_suffix(input: &[u8]) -> Result<Vec<u8>, pilgrim_core::EngineError> {
    let mut v = input.to_vec();
    v.extend_from_slice(b"::PILGRIM");
    Ok(v)
}

#[test]
fn deterministic_receipts_match_on_repeat_runs() {
    let engine = Engine::new(vec![
        EngineStep { name: "upper", func: step_upper },
        EngineStep { name: "suffix", func: step_suffix },
    ]);

    let intent = EngineIntent {
        intent_id: "intent-001".to_string(),
        statement: "run".to_string(),
        checksum: "handshake-checksum-placeholder".to_string(),
    };

    let r1 = engine.run("run-001", &intent, b"hello").unwrap();
    let r2 = engine.run("run-001", &intent, b"hello").unwrap();

    assert_eq!(r1.final_trace_hash, r2.final_trace_hash);
    assert_eq!(r1.steps, r2.steps);
}
