#!/usr/bin/env node
"use strict";

/**
 * Source Current (v1)
 * Canonical replacement for Zyte current accessor.
 * Bridge mode: reads Source current; if missing, falls back to legacy Zyte current.
 */

const fs = require("fs");
const path = require("path");

function readJson(p) {
  const s = fs.readFileSync(p, "utf8");
  return JSON.parse(s);
}

function main() {
  const root = process.cwd();
  const sourcePath = path.join(root, "source", "runtime", "current-source.json");
  const legacyPath = path.join(root, "zyte", "runtime", "current-zyte.json");

  if (fs.existsSync(sourcePath)) {
    process.stdout.write(JSON.stringify(readJson(sourcePath), null, 2) + "\n");
    return;
  }

  if (fs.existsSync(legacyPath)) {
    const legacy = readJson(legacyPath);
    const bridged = {
      schema: "amethyst.source.current.v1",
      source_id: legacy.zyte_id || "source-bridged-from-zyte",
      created_at_utc: null,
      bridge_from: "zyte/runtime/current-zyte.json",
      legacy
    };
    process.stdout.write(JSON.stringify(bridged, null, 2) + "\n");
    return;
  }

  process.stderr.write("NO_SOURCE_CURRENT\n");
  process.exit(2);
}

main();
