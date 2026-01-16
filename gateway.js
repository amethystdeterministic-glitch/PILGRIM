
import { handleCreateSource } from "./services/create-source.js";

if (req.method === "POST" && req.url === "/builder/create") {
  return handleCreateSource(req, res);
}


// --- SOURCES INDEX + LATEST ROUTES (v1) ---
import fs from "fs";
import path from "path";

function handleSourcesIndex(req, res) {
  const base = path.join(process.cwd(), "sources");

  if (!fs.existsSync(base)) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("No sources directory.");
  }

  const entries = fs
    .readdirSync(base)
    .filter(name => /^\d+$/.test(name))
    .sort();

  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <h1>Sources</h1>
    <ul>
      ${entries.map(e => `<li><a href="/sources/${e}/">${e}</a></li>`).join("")}
    </ul>
    <p><a href="/sources/latest">View latest</a></p>
  `);
}

function handleLatestSource(req, res) {
  const base = path.join(process.cwd(), "sources");

  if (!fs.existsSync(base)) {
    res.writeHead(404);
    return res.end("No sources.");
  }

  const entries = fs
    .readdirSync(base)
    .filter(name => /^\d+$/.test(name))
    .sort();

  if (!entries.length) {
    res.writeHead(404);
    return res.end("No sources.");
  }

  const latest = entries[entries.length - 1];
  res.writeHead(302, { Location: `/sources/${latest}/` });
  res.end();
}

// hook into existing router
const _origHandler = globalThis.handleRequest;
globalThis.handleRequest = function(req, res) {
  if (req.method === "GET" && req.url === "/sources") {
    return handleSourcesIndex(req, res);
  }
  if (req.method === "GET" && req.url === "/sources/latest") {
    return handleLatestSource(req, res);
  }
  return _origHandler(req, res);
};

