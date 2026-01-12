#!/usr/bin/env node
"use strict";

/*
 * SCRY Runtime Server (v1)
 * Read-only canonical introspection surface.
 *
 * Serves:
 *   - /health
 *   - /source/current
 *
 * Source precedence:
 *   1. source/runtime/current-source.json
 *   2. zyte/runtime/current-zyte.json (legacy bridge)
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.SCRY_PORT || 9191;
const ROOT = process.cwd();

function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function readSourceCurrent() {
  const sourcePath = path.join(ROOT, "source", "runtime", "current-source.json");
  const zytePath = path.join(ROOT, "zyte", "runtime", "current-zyte.json");

  if (fs.existsSync(sourcePath)) {
    return {
      schema: "amethyst.scry.source.v1",
      mode: "canonical",
      source: readJsonSafe(sourcePath)
    };
  }

  if (fs.existsSync(zytePath)) {
    return {
      schema: "amethyst.scry.source.v1",
      mode: "legacy-bridge",
      source: readJsonSafe(zytePath),
      bridge_from: "zyte/runtime/current-zyte.json"
    };
  }

  return null;
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET") {
    res.writeHead(405);
    return res.end();
  }

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("OK");
  }

  if (req.url === "/source/current") {
    const payload = readSourceCurrent();
    if (!payload) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("NO_SOURCE_AVAILABLE");
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(payload, null, 2));
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("UNKNOWN_ENDPOINT");
});

server.listen(PORT, () => {
  console.log(`SCRY listening on ${PORT}`);
});
