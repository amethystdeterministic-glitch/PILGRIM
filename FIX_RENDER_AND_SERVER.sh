#!/usr/bin/env bash
set -e

ROOT="$HOME/amethyst/runtime_v2"

echo "[1/3] Writing render_index.js (card renderer)"

cat << 'JS' > "$ROOT/lib/render_index.js"
import fs from "fs";
import path from "path";

export function renderIndex(res, dirPath, title, description = "") {
  let items = [];

  try {
    items = fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name)
      .sort();
  } catch {
    items = [];
  }

  const cards = items.length
    ? items.map(name => `
      <div class="card">
        <h2>${name.toUpperCase()}</h2>
        <p>Module</p>
        <a href="${name}/">Open</a>
      </div>
    `).join("\n")
    : `<p class="empty">No modules yet</p>`;

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
  body {
    margin:0;
    padding:2rem;
    background:#0b0b0e;
    color:#ddd;
    font-family:system-ui;
  }
  h1 {
    letter-spacing:.15em;
    margin-bottom:.25rem;
  }
  p.desc {
    opacity:.7;
    margin-bottom:2rem;
  }
  .grid {
    display:grid;
    grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
    gap:1.25rem;
  }
  .card {
    background:#111;
    border-radius:14px;
    padding:1.25rem;
    box-shadow:0 10px 30px rgba(0,0,0,.4);
  }
  .card h2 {
    margin:.25rem 0;
    font-size:1rem;
    letter-spacing:.12em;
  }
  .card p {
    opacity:.6;
    font-size:.85rem;
  }
  .card a {
    display:inline-block;
    margin-top:.75rem;
    padding:.5rem 1rem;
    border-radius:999px;
    background:#1f2937;
    color:#9ae6ff;
    text-decoration:none;
    font-size:.85rem;
  }
  .card a:hover {
    background:#374151;
  }
  .empty {
    opacity:.5;
  }
</style>
</head>
<body>
  <h1>${title}</h1>
  <p class="desc">${description}</p>
  <div class="grid">
    ${cards}
  </div>
</body>
</html>`);
}
JS

echo "[2/3] Writing server.js (single clean runtime)"

cat << 'JS' > "$ROOT/server.js"
#!/usr/bin/env node
"use strict";

import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderIndex } from "./lib/render_index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 9192;
const ROOT = __dirname;

function serveStatic(res, file) {
  if (!fs.existsSync(file)) {
    res.writeHead(404);
    return res.end("Not found");
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(fs.readFileSync(file));
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = url.pathname.replace(/\/+$/, "") || "/";

  if (p === "/" || p === "/portal") {
    return serveStatic(res, path.join(ROOT, "index.html"));
  }

  if (p === "/fun")
    return renderIndex(res, path.join(ROOT, "fun"), "FUN", "Games & experiments. Determinism you can feel.");

  if (p === "/pipeline")
    return renderIndex(res, path.join(ROOT, "pipeline"), "PIPELINE", "Deterministic application pipeline.");

  if (p === "/sources")
    return renderIndex(res, path.join(ROOT, "sources"), "SOURCES", "Deterministic source containers.");

  if (p === "/guards")
    return renderIndex(res, path.join(ROOT, "guards"), "GUARDS", "Deterministic enforcement modules.");

  const filePath = path.join(ROOT, p);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return serveStatic(res, filePath);
  }

  res.writeHead(404);
  res.end("Not found");
}).listen(PORT, () => {
  console.log(`AMETHYST RUNTIME v2 LIVE → http://127.0.0.1:${PORT}/portal/`);
});
JS

echo "[3/3] Restarting runtime"

pkill -f runtime_v2 || true
node "$ROOT/server.js" &
echo "✔ FIX COMPLETE — cards enabled, API locked"
