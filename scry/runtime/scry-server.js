#!/usr/bin/env node
"use strict";

import http from "http";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const PORT = process.env.SCRY_PORT || 9191;
const ROOT = process.env.SCRY_ROOT || process.cwd();
const LEDGER = path.join(ROOT, "source", "runtime", "source-ledger.ndjson");

function sha256(s) {
  return crypto.createHash("sha256").update(s).digest("hex");
}

function canonical(e) {
  return JSON.stringify({
    schema: e.schema,
    utc: e.utc,
    source_id: e.source_id,
    payload_hash: e.payload_hash,
    proof_path: e.proof_path,
    prev_hash: e.prev_hash,
  });
}

function verifyLedger() {
  if (!fs.existsSync(LEDGER)) {
    return { ok: false, error: "NO_LEDGER" };
  }

  const lines = fs.readFileSync(LEDGER, "utf8").trim().split("\n");
  let prev = "GENESIS";

  for (let i = 0; i < lines.length; i++) {
    const e = JSON.parse(lines[i]);

    const computed = sha256(canonical({
      ...e,
      prev_hash: prev,
    }));

    if (computed !== e.entry_hash) {
      return {
        ok: false,
        error: "BAD_ENTRY_HASH",
        line: i + 1,
        computed,
        got: e.entry_hash,
      };
    }

    prev = e.entry_hash;
  }

  return {
    ok: true,
    entries: lines.length,
    head: prev,
  };
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET") {
    res.writeHead(405);
    return res.end();
  }

  if (req.url === "/health") {
    res.writeHead(200);
    return res.end("OK");
  }

  if (req.url === "/source/verify") {
    const out = verifyLedger();
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      schema: "amethyst.source.verify.v1",
      ...out
    }, null, 2));
  }

  res.writeHead(404);
  res.end("UNKNOWN");
});

server.listen(PORT, () => {
  console.log(`SCRY listening on ${PORT}`);
});
