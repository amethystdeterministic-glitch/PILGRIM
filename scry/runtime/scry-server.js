import http from "http";
import fs from "fs";
import path from "path";

const PORT = process.env.SCRY_PORT || 9191;
const ROOT = process.env.SCRY_ROOT || process.cwd();

function safeRead(p) {
  const rp = path.resolve(p);
  if (!rp.startsWith(ROOT)) return null;
  if (!fs.existsSync(rp)) return null;
  return fs.readFileSync(rp, "utf-8");
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET") {
    res.writeHead(405);
    return res.end();
  }

  if (req.url === "/health") {
    res.writeHead(200);
    return res.end("OK");
  }

  if (req.url.startsWith("/read?")) {
    const target = new URL(req.url, "http://localhost").searchParams.get("path");
    const data = safeRead(target);
    if (!data) {
      res.writeHead(404);
      return res.end("NOT FOUND");
    }
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end(data);
  }

  res.writeHead(404);
  res.end("UNKNOWN");
});

server.listen(PORT, () => {
  console.log(`SCRY listening on ${PORT}`);
});
