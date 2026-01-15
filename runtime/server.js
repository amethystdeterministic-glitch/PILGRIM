#!/usr/bin/env node
"use strict";

/*
 AMETHYST DETERMINISTIC STATIC RUNTIME
 - ONE runtime
 - ONE port (9191)
 - Static only
 - Repo root as filesystem root
 - Portal fully removed
*/

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 9191;
const HOST = "127.0.0.1";
const ROOT = process.cwd();

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]);

  if (p.endsWith("/")) p += "index.html";

  const file = path.join(ROOT, p);

  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(err.code === "ENOENT" ? 404 : 500);
      return res.end("Not Found");
    }

    const ext = path.extname(file);
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "text/plain"
    });
    res.end(data);
  });
}).listen(PORT, HOST, () => {
  console.log("GREEN");
  console.log(`Runtime listening at http://127.0.0.1:${PORT}`);
  console.log("Mode: Static only | Portal removed");
});
