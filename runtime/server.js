#!/usr/bin/env node
"use strict";

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const PORT = Number(process.env.SCRY_PORT || 9191);
const ROOT = process.cwd();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function send(res, status, body, type = "text/plain") {
  res.writeHead(status, { "Content-Type": type });
  res.end(body);
}

function serveFile(res, filePath) {
  if (!fs.existsSync(filePath)) {
    send(res, 404, "Not Found");
    return;
  }

  // 🔒 DIRECTORY GUARD (THE FIX)
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    const indexFile = path.join(filePath, "index.html");
    if (!fs.existsSync(indexFile)) {
      send(res, 404, "Not Found");
      return;
    }
    filePath = indexFile;
  }

  const ext = path.extname(filePath);
  const type =
    ext === ".html" ? "text/html" :
    ext === ".css"  ? "text/css"  :
    "text/plain";

  send(res, 200, fs.readFileSync(filePath), type);
}

const server = http.createServer((req, res) => {
  const url = req.url.replace(/\/+$/, "") || "/";

  // Sources index
  if (url === "/sources") {
    return serveFile(res, path.join(ROOT, "sources"));
  }

  // Individual sources
  if (url.startsWith("/sources/")) {
    return serveFile(res, path.join(ROOT, url));
  }

  // Tiers page
  if (url === "/tiers") {
    return serveFile(res, path.join(ROOT, "public", "tiers"));
  }

  send(res, 404, "Not Found");
});

server.listen(PORT, "127.0.0.1", () => {
  console.log("GREEN");
  console.log(`Runtime listening at http://127.0.0.1:${PORT}`);
  console.log("Mode: Static only | Portal removed");
});
