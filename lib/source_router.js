import fs from "fs";
import path from "path";
import { mimeType } from "./mime.js";

function safeJoin(base, requestPath) {
  // Prevent ../ traversal
  const resolved = path.normalize(path.join(base, requestPath));
  if (!resolved.startsWith(base)) return null;
  return resolved;
}

function serveFile(res, filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    res.writeHead(404);
    return res.end("Not found");
  }

  const type = mimeType(filePath);
  res.writeHead(200, { "Content-Type": type });
  res.end(fs.readFileSync(filePath));
}

export function handleSources(req, res, ROOT, renderIndex) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // /sources or /sources/
  if (pathname === "/sources" || pathname === "/sources/") {
    return renderIndex(
      res,
      path.join(ROOT, "sources"),
      "SOURCES",
      "Your sovereign pages. No hosting. No gatekeeping."
    );
  }

  // Strip "/sources/"
  const tail = pathname.replace(/^\/sources\/+/, "");
  const parts = tail.split("/").filter(Boolean);
  const box = parts[0];

  if (!box) {
    res.writeHead(404);
    return res.end("Not found");
  }

  const boxRoot = path.join(ROOT, "sources", box);
  if (!fs.existsSync(boxRoot) || !fs.statSync(boxRoot).isDirectory()) {
    res.writeHead(404);
    return res.end("Source not found");
  }

  // /sources/<box>/builder/*
  if (parts[1] === "builder") {
    const builderRoot = path.join(boxRoot, "builder");
    const builderIndex = path.join(builderRoot, "index.html");
    if (fs.existsSync(builderIndex)) return serveFile(res, builderIndex);

    // Placeholder until we drop builder UI
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(`<!doctype html>
<html><head><meta charset="utf-8"/><title>Builder</title>
<style>
body{font-family:system-ui;margin:2rem;background:#0b0b0e;color:#ddd}
.card{background:#111;padding:1.25rem;border-radius:14px;max-width:720px}
small{opacity:.7}
a{color:#9ae6ff}
</style></head>
<body>
  <div class="card">
    <h1>Builder (reserved)</h1>
    <p>This Source Box is builder-ready. UI will drop here.</p>
    <small>Path: <code>/sources/${box}/builder/</code></small>
    <p style="margin-top:1rem;"><a href="/sources/${box}/">Back to Source</a></p>
  </div>
</body></html>`);
  }

  // /sources/<box>/media/*
  if (parts[1] === "media") {
    const mediaTail = parts.slice(2).join("/");
    const mediaRoot = path.join(boxRoot, "media");
    const candidate = safeJoin(mediaRoot, mediaTail);
    if (!candidate) {
      res.writeHead(400);
      return res.end("Bad path");
    }
    return serveFile(res, candidate);
  }

  // /sources/<box>/... (default: serve source index)
  // Prefer:
  // 1) /sources/<box>/index.html
  // 2) /sources/<box>/pages/index.html (future builder structure)
  // 3) /sources/<box>/pages/home.html (optional future)
  const directIndex = path.join(boxRoot, "index.html");
  const pagesIndex = path.join(boxRoot, "pages", "index.html");
  const pagesHome = path.join(boxRoot, "pages", "home.html");

  if (fs.existsSync(directIndex)) return serveFile(res, directIndex);
  if (fs.existsSync(pagesIndex)) return serveFile(res, pagesIndex);
  if (fs.existsSync(pagesHome)) return serveFile(res, pagesHome);

  // If they request a specific file under the source root, allow it safely
  const rel = parts.slice(1).join("/");
  if (rel) {
    const candidate = safeJoin(boxRoot, rel);
    if (candidate && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return serveFile(res, candidate);
    }
  }

  res.writeHead(404);
  res.end("Source has no index.html yet");
}
