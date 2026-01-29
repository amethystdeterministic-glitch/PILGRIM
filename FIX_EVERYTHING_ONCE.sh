#!/usr/bin/env bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
LIB="$ROOT/lib"
SERVER="$ROOT/server.js"

mkdir -p "$LIB" "$ROOT/portal" "$ROOT/fun" "$ROOT/pipeline" "$ROOT/sources" "$ROOT/guards"

# -------------------------------
# render_index.js (single source of truth)
# -------------------------------
cat << 'JS' > "$LIB/render_index.js"
import fs from "fs";
import path from "path";

export function renderIndex(res, dir, title, baseUrl = "/") {
  let items = [];
  try {
    items = fs.readdirSync(dir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  } catch {
    items = [];
  }

  const links = items.map(n =>
    `<li><a href="${baseUrl}${n}/">${n}</a></li>`
  ).join("");

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>${title}</title>
<style>
body{background:#0b0b0e;color:#ddd;font-family:sans-serif;padding:2rem}
h1{letter-spacing:.2em}
a{color:#9aa6ff;text-decoration:none}
li{margin:.5rem 0}
</style>
</head>
<body>
<h1>${title}</h1>
<ul>${links || "<li>(empty)</li>"}</ul>
</body>
</html>`);
}
JS

# -------------------------------
# server.js (clean, minimal, deterministic)
# -------------------------------
cat << 'JS' > "$SERVER"
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { renderIndex } from "./lib/render_index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const ROOT = __dirname;
const PORT = 9192;

const routes = {
  "/":          "portal",
  "/portal":    "portal",
  "/fun":       "fun",
  "/pipeline":  "pipeline",
  "/sources":   "sources",
  "/guards":    "guards"
};

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  const p = url.pathname.replace(/\/+$/, "") || "/";

  if (routes[p]) {
    return renderIndex(
      res,
      path.join(ROOT, routes[p]),
      routes[p].toUpperCase(),
      p === "/" ? "/" : p + "/"
    );
  }

  for (const base in routes) {
    if (p.startsWith(base + "/")) {
      const rel = p.slice(base.length + 1);
      const filePath = path.join(ROOT, routes[base], rel, "index.html");
      if (fs.existsSync(filePath)) {
        res.writeHead(200, { "Content-Type": "text/html" });
        return fs.createReadStream(filePath).pipe(res);
      }
    }
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log("runtime_v2 listening on", PORT);
});
JS

# -------------------------------
# seed index.html if missing
# -------------------------------
for d in portal fun pipeline sources guards; do
  if [ ! -f "$ROOT/$d/index.html" ]; then
    cat << HTML > "$ROOT/$d/index.html"
<!doctype html>
<html><body>
<h1>${d^^}</h1>
<p>Deterministic container.</p>
</body></html>
HTML
  fi
done

pkill -f runtime_v2/server.js || true
node "$SERVER" &

echo "✔ ALL FIXED — clean server, clean links, auto-list enabled"
