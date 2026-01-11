// zyte/runtime/zyte-server.js
// DETLINE MASTER — full replacement

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const HOST = "127.0.0.1";
const PORT = 9090;

const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function zytePath(id) {
  return path.join(DATA_DIR, `${id}.json`);
}

function loadZyte(id) {
  const p = zytePath(id);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function saveZyte(z) {
  fs.writeFileSync(zytePath(z.id), JSON.stringify(z, null, 2));
}

function send(res, code, body, headers = {}) {
  res.writeHead(code, { "Content-Type": "text/plain", ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url, true);

  // RENDER
  if (req.method === "GET" && parsed.pathname.startsWith("/render/")) {
    const id = parsed.pathname.replace("/render/", "");
    const z = loadZyte(id);
    if (!z) return send(res, 404, "Not found");
    return send(res, 200, z.content || "");
  }

  // CREATE / UPDATE (DETLINE MERGED)
  if (
    req.method === "POST" &&
    (parsed.pathname === "/zyte/create" ||
     parsed.pathname === "/zyte/update")
  ) {
    let buf = "";
    req.on("data", d => (buf += d));
    req.on("end", () => {
      try {
        const z = JSON.parse(buf);
        if (!z.id) return send(res, 400, "Missing id");
        const existing = loadZyte(z.id) || {};
        saveZyte({ ...existing, ...z });
        return send(res, 200, existing.id ? "Updated" : "Created");
      } catch (e) {
        return send(res, 400, "Bad JSON");
      }
    });
    return;
  }

  send(res, 404, "Not found");
});

server.listen(PORT, HOST, () => {
  console.log(`Zyte API listening on ${HOST}:${PORT}`);
});

