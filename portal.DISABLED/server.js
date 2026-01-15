import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const ROOT = path.resolve(__dirname);

const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".wasm": "application/wasm",
  ".json": "application/json"
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      return res.end("Not Found");
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": mime[ext] || "application/octet-stream"
    });
    res.end(data);
  });
}

http.createServer((req, res) => {

  // ===============================
  // STATUS SURFACE (root)
  // ===============================
  if (req.url === "/" || req.url === "/status") {
    res.writeHead(200, { "Content-Type": "text/html" });
    return res.end(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>Amethyst Portal</title>
  <style>
    body { background:#0b0f1a; color:#e6e9f0; font-family:system-ui; padding:24px; }
    .card { background:#121833; border-radius:16px; padding:20px; margin-bottom:16px; }
    .ok { color:#6cff8f; }
    .bad { color:#ff6c6c; }
  </style>
</head>
<body>
  <h1>Amethyst Portal</h1>

  <div class="card">
    <h2>System</h2>
    <div id="system">Checking…</div>
  </div>

  <div class="card">
    <h2>Source Head</h2>
    <div id="head">Checking…</div>
  </div>

  <div class="card">
    <h2>Source Verify</h2>
    <div id="verify">Checking…</div>
  </div>

  <script>
    (async () => {
      try {
        const r = await fetch("http://127.0.0.1:9190/api/source/status");
        const j = await r.json();
        document.getElementById("system").innerHTML =
          j.ok ? "<span class='ok'>Available</span>" : "<span class='bad'>Unavailable</span>";
        document.getElementById("head").innerHTML =
          j.head_ok ? "<span class='ok'>Ledger OK</span>" : "<span class='bad'>Ledger Error</span>";
        document.getElementById("verify").innerHTML =
          j.verify_ok ? "<span class='ok'>Verified</span>" : "<span class='bad'>Failed</span>";
      } catch {
        document.getElementById("system").innerHTML = "<span class='bad'>Error</span>";
      }
    })();
  </script>
</body>
</html>
    `);
  }

  // ===============================
  // UI SURFACE (/ui)
  // ===============================
  if (req.url === "/ui" || req.url === "/ui/") {
    return serveFile(res, path.join(ROOT, "ui/index.html"));
  }

  if (req.url.startsWith("/ui/")) {
    const rel = req.url.replace("/ui/", "");
    const filePath = path.join(ROOT, "ui", rel);
    if (!filePath.startsWith(path.join(ROOT, "ui"))) {
      res.writeHead(403);
      return res.end("Forbidden");
    }
    return serveFile(res, filePath);
  }

  res.writeHead(404);
  res.end("Not Found");
}).listen(PORT, () => {
  console.log("PORTAL listening on 8080");
  console.log("STATUS  -> http://127.0.0.1:8080/");
  console.log("UI      -> http://127.0.0.1:8080/ui");
});
