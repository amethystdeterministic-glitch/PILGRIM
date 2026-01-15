import fs from "fs";
import path from "path";

const ROOT = path.resolve("source/runtime");
const LEDGER = path.join(ROOT, "source-ledger.ndjson");

export function getSourceStatus(id) {
  // ✅ GLOBAL STATUS (no id = system card)
  if (!id) {
    return {
      ok: true,
      runtime: "source",
      ledger: fs.existsSync(LEDGER),
      count: fs.existsSync(LEDGER)
        ? fs.readFileSync(LEDGER, "utf-8").trim().split("\n").length - 1
        : 0,
      utc: new Date().toISOString()
    };
  }

  // ✅ PER-SOURCE STATUS (source cards)
  if (!fs.existsSync(LEDGER)) {
    return { ok: false, error: "LEDGER_NOT_FOUND" };
  }

  const entries = fs.readFileSync(LEDGER, "utf-8")
    .trim()
    .split("\n")
    .map(l => JSON.parse(l))
    .filter(e => e.type === "source.create");

  const match = entries.find(e => e.payload?.id === id);

  if (!match) {
    return { ok: false, error: "SOURCE_NOT_FOUND" };
  }

  return {
    ok: true,
    id,
    head: match.entry_hash,
    created_at: match.utc
  };
}
