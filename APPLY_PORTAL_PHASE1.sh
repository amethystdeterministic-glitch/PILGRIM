#!/usr/bin/env bash
set -euo pipefail

ROOT="$HOME/amethyst/runtime_v2"

echo "[1/6] Ensure core surface folders exist"
mkdir -p \
  "$ROOT/portal" \
  "$ROOT/fun" \
  "$ROOT/sources" \
  "$ROOT/pipeline" \
  "$ROOT/guards" \
  "$ROOT/mastermold" \
  "$ROOT/tiers" \
  "$ROOT/settings" \
  "$ROOT/lib"

echo "[2/6] Write card renderer (shared)"
cat << 'JS' > "$ROOT/lib/render_index.js"
import fs from "fs";
import path from "path";

function safeTitle(s) {
  return String(s || "").trim() || "INDEX";
}

export function renderIndex(res, dirPath, title, description = "") {
  let dirs = [];
  let files = [];

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    dirs = entries.filter(e => e.isDirectory()).map(e => e.name).sort();
    files = entries
      .filter(e => e.isFile())
      .map(e => e.name)
      .filter(n => n.toLowerCase() !== "index.html")
      .sort();
  } catch {
    dirs = [];
    files = [];
  }

  const cards =
    (dirs.length
      ? dirs.map(name => `
        <div class="card">
          <div class="cardTop">
            <div class="kicker">MODULE</div>
            <h2>${name.toUpperCase()}</h2>
          </div>
          <div class="cardBottom">
            <a class="btn" href="${encodeURIComponent(name)}/">Open</a>
          </div>
        </div>
      `).join("\n")
      : `<div class="empty">No modules yet</div>`)
    +
    (files.length
      ? `
        <div class="section">
          <div class="kicker">FILES</div>
          <div class="fileGrid">
            ${files.map(f => `
              <a class="file" href="${encodeURIComponent(f)}">${f}</a>
            `).join("\n")}
          </div>
        </div>
      `
      : "");

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle(title)}</title>
  <style>
    :root{
      --bg:#0b0b0e;
      --panel:rgba(17,17,22,.92);
      --panel2:rgba(30,27,75,.40);
      --text:#e5e7eb;
      --muted:#9ca3af;
      --border:#2D1B69;
      --accent:#8B5CF6;
      --accent2:#C4B5FD;
    }
    *{box-sizing:border-box}
    body{
      margin:0;
      background:var(--bg);
      color:var(--text);
      font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      padding:24px;
      line-height:1.55;
    }
    .wrap{max-width:1100px;margin:0 auto}
    .hdr{
      display:flex;align-items:flex-end;justify-content:space-between;gap:16px;
      padding:18px 0 18px;border-bottom:1px solid var(--border);
      margin-bottom:22px;
    }
    .brand{display:flex;align-items:center;gap:12px}
    .hex{
      width:28px;height:28px;background:linear-gradient(135deg,var(--accent),#A855F7);
      clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      position:relative;
    }
    .hex::after{
      content:"";position:absolute;inset:2px;background:var(--bg);
      clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }
    h1{margin:0;font-size:22px;letter-spacing:.14em;text-transform:uppercase}
    .desc{margin:6px 0 0;color:var(--muted);max-width:70ch}
    .badge{
      font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
      font-size:12px;color:var(--muted);
      padding:6px 10px;border:1px solid var(--border);border-radius:6px;
      background:rgba(30,27,75,.35);
      white-space:nowrap;
    }
    .grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
      gap:14px;
      margin-top:18px;
    }
    .card{
      background:var(--panel);
      border:1px solid rgba(255,255,255,.06);
      border-radius:16px;
      padding:16px;
      box-shadow:0 14px 40px rgba(0,0,0,.45);
      display:flex;flex-direction:column;justify-content:space-between;
      min-height:140px;
    }
    .kicker{
      font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);
      margin-bottom:8px;
    }
    h2{margin:0;font-size:15px;letter-spacing:.10em}
    .btn{
      display:inline-block;
      margin-top:12px;
      padding:10px 14px;
      border-radius:999px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(31,41,55,.75);
      color:#9ae6ff;
      text-decoration:none;
      font-size:13px;
    }
    .btn:hover{border-color:var(--accent);background:rgba(139,92,246,.10)}
    .empty{
      opacity:.6;
      padding:18px;
      border:1px dashed rgba(255,255,255,.15);
      border-radius:14px;
      background:rgba(30,27,75,.20);
    }
    .section{margin-top:18px;padding-top:18px;border-top:1px solid rgba(255,255,255,.06)}
    .fileGrid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(220px,1fr));
      gap:10px;
      margin-top:10px;
    }
    .file{
      display:block;
      padding:12px 14px;
      border-radius:12px;
      border:1px solid rgba(255,255,255,.06);
      background:rgba(30,27,75,.22);
      color:var(--text);
      text-decoration:none;
      font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
      font-size:12px;
    }
    .file:hover{border-color:var(--accent);background:rgba(139,92,246,.10)}
    @media (max-width:640px){
      body{padding:16px}
      .hdr{align-items:flex-start;flex-direction:column}
      .badge{align-self:flex-start}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <div>
        <div class="brand">
          <div class="hex"></div>
          <h1>${safeTitle(title)}</h1>
        </div>
        ${description ? `<div class="desc">${description}</div>` : ``}
      </div>
      <div class="badge">AUTO-INDEX</div>
    </div>

    <div class="grid">
      ${cards}
    </div>
  </div>
</body>
</html>`);
}
JS

echo "[3/6] Write PORTAL surface (cards: FUN + SOURCES + PIPELINE + GUARDS + MASTERMOLD + TIERS + SETTINGS)"
cat << 'HTML' > "$ROOT/portal/index.html"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Amethyst Portal</title>
  <style>
    :root{
      --bg:#0b0b0e;
      --panel:rgba(17,17,22,.92);
      --text:#e5e7eb;
      --muted:#9ca3af;
      --border:#2D1B69;
      --accent:#8B5CF6;
      --accent2:#C4B5FD;
    }
    *{box-sizing:border-box}
    body{
      margin:0;background:var(--bg);color:var(--text);
      font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
      padding:24px;line-height:1.55;
    }
    .wrap{max-width:1100px;margin:0 auto}
    .hdr{
      display:flex;justify-content:space-between;align-items:flex-end;gap:18px;
      padding:18px 0;border-bottom:1px solid var(--border);margin-bottom:18px;
    }
    .brand{display:flex;align-items:center;gap:12px}
    .hex{
      width:30px;height:30px;background:linear-gradient(135deg,var(--accent),#A855F7);
      clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
      position:relative;
    }
    .hex::after{
      content:"";position:absolute;inset:2px;background:var(--bg);
      clip-path:polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    }
    h1{margin:0;font-size:22px;letter-spacing:.14em;text-transform:uppercase}
    .sub{margin:6px 0 0;color:var(--muted);max-width:72ch}
    .badge{
      font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,"Liberation Mono",monospace;
      font-size:12px;color:var(--muted);
      padding:6px 10px;border:1px solid var(--border);border-radius:6px;
      background:rgba(30,27,75,.35);
      white-space:nowrap;
    }
    .grid{
      display:grid;
      grid-template-columns:repeat(auto-fill,minmax(240px,1fr));
      gap:14px;
      margin-top:18px;
    }
    .card{
      background:var(--panel);
      border:1px solid rgba(255,255,255,.06);
      border-radius:16px;
      padding:16px;
      box-shadow:0 14px 40px rgba(0,0,0,.45);
      min-height:150px;
      display:flex;flex-direction:column;justify-content:space-between;
    }
    .kicker{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}
    .title{margin:0;font-size:16px;letter-spacing:.10em}
    .desc{margin:10px 0 0;color:var(--muted);font-size:13px}
    .row{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
    .btn{
      display:inline-block;
      padding:10px 14px;border-radius:999px;
      border:1px solid rgba(255,255,255,.08);
      background:rgba(31,41,55,.75);
      color:#9ae6ff;text-decoration:none;font-size:13px;
    }
    .btn:hover{border-color:var(--accent);background:rgba(139,92,246,.10)}
    .btn.primary{color:var(--text);background:rgba(139,92,246,.18);border-color:rgba(139,92,246,.35)}
    .btn.primary:hover{background:rgba(139,92,246,.26)}
    @media (max-width:640px){
      body{padding:16px}
      .hdr{flex-direction:column;align-items:flex-start}
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="hdr">
      <div>
        <div class="brand">
          <div class="hex"></div>
          <h1>Amethyst Portal</h1>
        </div>
        <div class="sub">Launch surface for your local runtime. Open a box, then open what’s inside.</div>
      </div>
      <div class="badge">RUNTIME v2</div>
    </div>

    <div class="grid">
      <div class="card">
        <div>
          <div class="kicker">FUN</div>
          <h2 class="title">Fun Box</h2>
          <div class="desc">Chess, Cymatics, and more experiments.</div>
        </div>
        <div class="row">
          <a class="btn primary" href="/fun/">Open</a>
        </div>
      </div>

      <div class="card">
        <div>
          <div class="kicker">SOURCES</div>
          <h2 class="title">Source Box</h2>
          <div class="desc">Static pages you own. No hosting. No gatekeeping.</div>
        </div>
        <div class="row">
          <a class="btn primary" href="/sources/">Open</a>
        </div>
      </div>

      <div class="card">
        <div>
          <div class="kicker">PIPELINE</div>
          <h2 class="title">Pipeline Box</h2>
          <div class="desc">Launch apps: Write, Matrix, Studio, Mundo.</div>
        </div>
        <div class="row">
          <a class="btn primary" href="/pipeline/">Open</a>
        </div>
      </div>

      <div class="card">
        <div>
          <div class="kicker">GUARDS</div>
          <h2 class="title">Guard Box</h2>
          <div class="desc">Enforcement modules. FamilyGuard first.</div>
        </div>
        <div class="row">
          <a class="btn primary" href="/guards/">Open</a>
        </div>
      </div>

      <div class="card">
        <div>
          <div class="kicker">MASTERMOLD</div>
          <h2 class="title">MasterMold</h2>
          <div class="desc">Your private build surface. Not for public release.</div>
        </div>
        <div class="row">
          <a class="btn primary" href="/mastermold/">Open</a>
        </div>
      </div>

      <div class="card">
        <div>
          <div class="kicker">TIERS</div>
          <h2 class="title">Tiers</h2>
          <div class="desc">Pricing + what each tier includes.</div>
        </div>
        <div class="row">
          <a class="btn primary" href="/tiers/">Open</a>
        </div>
      </div>

      <div class="card">
        <div>
          <div class="kicker">SETTINGS</div>
          <h2 class="title">Settings</h2>
          <div class="desc">Runtime preferences (safe defaults for v1).</div>
        </div>
        <div class="row">
          <a class="btn primary" href="/settings/">Open</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
HTML

echo "[4/6] Write minimal surface index.html files (so every box opens today)"
# Top-level landing (optional) -> send people to /portal/
cat << 'HTML' > "$ROOT/index.html"
<!doctype html><html lang="en"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Amethyst Runtime v2</title>
<style>body{margin:0;background:#0b0b0e;color:#e5e7eb;font-family:system-ui;padding:24px}a{color:#9ae6ff}</style>
</head><body>
<h1>Amethyst Runtime v2</h1>
<p><a href="/portal/">Open Portal</a></p>
</body></html>
HTML

# If a surface has no index.html yet, create a simple placeholder that still feels intentional
ensure_index () {
  local dir="$1"
  local title="$2"
  local body="$3"
  if [ ! -f "$dir/index.html" ]; then
    cat << HTML > "$dir/index.html"
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>$title</title>
<style>
body{margin:0;background:#0b0b0e;color:#e5e7eb;font-family:system-ui;padding:24px;line-height:1.6}
a{color:#9ae6ff;text-decoration:none} a:hover{text-decoration:underline}
.card{max-width:820px;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;background:rgba(17,17,22,.92)}
.m{color:#9ca3af}
</style>
</head><body>
<div class="card">
<h1>$title</h1>
<p class="m">$body</p>
<p><a href="/portal/">← Portal</a></p>
</div>
</body></html>
HTML
  fi
}

ensure_index "$ROOT/pipeline"  "PIPELINE"   "This is the container for launch apps. Add subfolders like /pipeline/write/ then the box will auto-list them."
ensure_index "$ROOT/guards"    "GUARDS"     "This is the container for Guards. Add /guards/familyguard/ and it will appear here automatically."
ensure_index "$ROOT/mastermold" "MASTERMOLD" "Private surface for your master build. This will be removed from public builds."
ensure_index "$ROOT/settings" "SETTINGS"   "Runtime settings surface. Keep it simple for v1."
ensure_index "$ROOT/tiers"    "TIERS"      "This surface links to the public tiers Source."

# Make TIERS open the Source tiers page (so users get the real content)
cat << 'HTML' > "$ROOT/tiers/index.html"
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>TIERS</title>
<style>
body{margin:0;background:#0b0b0e;color:#e5e7eb;font-family:system-ui;padding:24px;line-height:1.6}
a{color:#9ae6ff;text-decoration:none} a:hover{text-decoration:underline}
.box{max-width:820px;border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:18px;background:rgba(17,17,22,.92)}
.m{color:#9ca3af}
.btn{display:inline-block;margin-top:10px;padding:10px 14px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(31,41,55,.75);color:#9ae6ff;text-decoration:none}
.btn:hover{border-color:#8B5CF6;background:rgba(139,92,246,.10)}
</style>
</head><body>
<div class="box">
<h1>TIERS</h1>
<p class="m">Pricing lives in Sources. Use the button to open the canonical tiers page.</p>
<a class="btn" href="/sources/tiers/">Open Tiers Source →</a>
<p style="margin-top:14px"><a href="/portal/">← Portal</a></p>
</div>
</body></html>
HTML

echo "[5/6] Write clean server.js (single source of truth; directory index + static)"
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

const PORT = Number(process.env.AMETHYST_PORT || 9192);
const ROOT = __dirname;

function exists(p) {
  try { fs.accessSync(p); return true; } catch { return false; }
}

function serveFile(res, file) {
  if (!exists(file)) {
    res.writeHead(404);
    return res.end("Not found");
  }
  const ext = path.extname(file).toLowerCase();
  const type =
    ext === ".html" ? "text/html; charset=utf-8" :
    ext === ".js"   ? "text/javascript; charset=utf-8" :
    ext === ".json" ? "application/json; charset=utf-8" :
    ext === ".css"  ? "text/css; charset=utf-8" :
    "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  res.end(fs.readFileSync(file));
}

function serveDirIndex(res, dirPath, title, description) {
  return renderIndex(res, dirPath, title, description);
}

function cleanPathname(u) {
  const p = u.pathname || "/";
  // normalize multiple slashes
  return p.replace(/\/+/g, "/");
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const p = cleanPathname(url);

  // --- PORTAL ---
  if (p === "/" || p === "/portal" || p === "/portal/") {
    return serveFile(res, path.join(ROOT, "portal", "index.html"));
  }

  // --- Box indexes (render cards for child folders) ---
  if (p === "/fun" || p === "/fun/") {
    return serveDirIndex(res, path.join(ROOT, "fun"), "FUN", "Games & experiments.");
  }
  if (p === "/sources" || p === "/sources/") {
    return serveDirIndex(res, path.join(ROOT, "sources"), "SOURCES", "Static pages you own.");
  }
  if (p === "/pipeline" || p === "/pipeline/") {
    return serveDirIndex(res, path.join(ROOT, "pipeline"), "PIPELINE", "Launch apps live here.");
  }
  if (p === "/guards" || p === "/guards/") {
    return serveDirIndex(res, path.join(ROOT, "guards"), "GUARDS", "Enforcement modules live here.");
  }
  if (p === "/mastermold" || p === "/mastermold/") {
    return serveDirIndex(res, path.join(ROOT, "mastermold"), "MASTERMOLD", "Private master build surface.");
  }
  if (p === "/tiers" || p === "/tiers/") {
    return serveFile(res, path.join(ROOT, "tiers", "index.html"));
  }
  if (p === "/settings" || p === "/settings/") {
    return serveFile(res, path.join(ROOT, "settings", "index.html"));
  }

  // --- Directory resolution: if /x/y/ then serve index.html if exists ---
  const resolved = path.join(ROOT, p);
  if (exists(resolved) && fs.statSync(resolved).isDirectory()) {
    const idx = path.join(resolved, "index.html");
    if (exists(idx)) return serveFile(res, idx);
  }

  // --- File fallback ---
  if (exists(resolved) && fs.statSync(resolved).isFile()) {
    return serveFile(res, resolved);
  }

  res.writeHead(404);
  res.end("Not found");
}).listen(PORT, () => {
  console.log(`AMETHYST RUNTIME v2 LIVE → http://127.0.0.1:${PORT}/portal/`);
});
JS

chmod +x "$ROOT/server.js"

echo "[6/6] Restart runtime"
pkill -f "$ROOT/server.js" 2>/dev/null || true
pkill -f "amethyst/runtime_v2/server.js" 2>/dev/null || true
node "$ROOT/server.js" &

echo "✔ GREEN — Portal Phase 1 applied"
echo
echo "LINKS:"
echo "  Portal     → http://127.0.0.1:9192/portal/"
echo "  FUN        → http://127.0.0.1:9192/fun/"
echo "  Sources    → http://127.0.0.1:9192/sources/"
echo "  Pipeline   → http://127.0.0.1:9192/pipeline/"
echo "  Guards     → http://127.0.0.1:9192/guards/"
echo "  MasterMold → http://127.0.0.1:9192/mastermold/"
echo "  Tiers      → http://127.0.0.1:9192/tiers/"
echo "  Settings   → http://127.0.0.1:9192/settings/"
