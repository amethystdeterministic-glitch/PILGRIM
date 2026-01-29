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
