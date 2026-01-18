# Lopez Engine

Lopez Engine is a deterministic execution engine written in Rust.

## Scope
- Pure Rust core
- Deterministic state machine
- No UI
- No Node runtime
- No Amethyst / Pilgrim contamination

## Runtime State
All runtime state (ledger files, databases, keys, environment scripts)
is intentionally excluded via .gitignore.

## Usage
This engine is intended to be executed as a sovereign process and
consumed by external systems (e.g. Amethyst Portal) via IPC, CLI, or sockets.

