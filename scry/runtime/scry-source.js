#!/usr/bin/env node
"use strict";

/**
 * SCRY Source Resolver (v1)
 * Read-only access to canonical Source state.
 * Falls back to legacy Zyte for backward compatibility.
 */

const fs = require("fs");
const path = require("path");

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function main() {
  const root = process.cwd();

  const sourceCurrent = path.join(root, "source", "runtime", "current-source.json");
  const zyteCurrent = path.join(root, "zyte", "runtime", "current-zyte.json");

  if (fs.existsSync(sourceCurrent)) {
    process.stdout.write(JSON.stringify({
      schema: "amethyst.scry.source.v1",
      mode: "canonical",
      source: readJson(sourceCurrent)
    }, null, 2) + "\n");
    return;
  }

  if (fs.existsSync(zyteCurrent)) {
    process.stdout.write(JSON.stringify({
      schema: "amethyst.scry.source.v1",
      mode: "legacy-bridge",
      source: readJson(zyteCurrent)
    }, null, 2) + "\n");
    return;
  }

  process.stderr.write("SCRY_NO_SOURCE_AVAILABLE\n");
  process.exit(2);
}

main();
