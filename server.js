import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";
import { renderSources } from "./lib/render_sources.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 9192;

app.use(express.json());
app.use(express.static(__dirname));

/* =========================
   PORTAL
   ========================= */
app.get("/portal", (_req, res) => {
  res.sendFile(path.join(__dirname, "portal", "index.html"));
});

/* =========================
   CREATE SOURCE API
   ========================= */
app.post("/api/source/create", (req, res) => {
  const name = req.body?.name;

  if (!name || !/^[a-z0-9_-]+$/i.test(name)) {
    return res.status(400).json({ error: "Invalid source name" });
  }

  const cmd = `${process.env.HOME}/amethyst/runtime_v2/_source_template.sh ${name}`;

  exec(cmd, err => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Source creation failed" });
    }

    exec(`${process.env.HOME}/amethyst/runtime_v2/_build_sources_registry.sh`);
    res.json({ ok: true, source: name });
  });
});

/* =========================
   SOURCES INDEX (MUST BE FIRST)
   ========================= */
app.get("/sources", (_req, res) => {
  renderSources(res, __dirname);
});

/* =========================
   SOURCES STATIC (SUBPATHS ONLY)
   ========================= */
app.use("/sources/", express.static(path.join(__dirname, "sources")));

/* =========================
   ROOT
   ========================= */
app.get("/", (_req, res) => res.redirect("/portal"));

app.listen(PORT, () => {
  console.log(`AMETHYST RUNTIME v2 LIVE → http://127.0.0.1:${PORT}/portal/`);
});

/* CONFIG (read-only) */
app.use("/config", express.static(path.join(__dirname, "config")));

// ===============================
// PAGE CREATE API
// ===============================
import { createPage } from "./lib/page_actions.js";

app.post("/api/page/create", (req, res) => {
  createPage(req, res, __dirname);
});

// ===============================
// SOURCE PAGE RESOLUTION FIX
// ===============================
app.use("/sources", (req, res, next) => {
  const fs = require("fs");
  const path = require("path");

  const base = path.join(__dirname, "sources");
  const reqPath = req.path.replace(/\/+$/, "");
  const fullPath = path.join(base, reqPath);

  // Serve file directly if it exists
  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    return res.sendFile(fullPath);
  }

  // Serve index.html inside directory
  const indexFile = path.join(fullPath, "index.html");
  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }

  next();
});

// Static fallback
app.use("/sources", express.static(path.join(__dirname, "sources")));


// ===============================
// SOURCE SUBPAGE AUTO-RESOLUTION
// /sources/<source>/<page>/
// ===============================
app.get("/sources/:source/:page/", (req, res) => {
  const fs = require("fs");
  const path = require("path");

  const { source, page } = req.params;
  const base = path.join(__dirname, "sources", source, page);
  const indexFile = path.join(base, "index.html");

  if (fs.existsSync(indexFile)) {
    return res.sendFile(indexFile);
  }

  res.status(404).send("Page not found");
});


// ===============================
// PAGE CREATE API
// ===============================
import { createPage } from "./lib/page_actions.js";

app.post("/api/page/create", (req, res) => {
  createPage(req, res, __dirname);
});
