"use strict";

const fs = require("fs");
const path = require("path");

const HISTORY = path.join(__dirname, "../history/history.json");

function loadHistory() {
  return JSON.parse(fs.readFileSync(HISTORY, "utf8"));
}

function saveHistory(h) {
  fs.writeFileSync(HISTORY, JSON.stringify(h, null, 2));
}

function recordVersion(zyte) {
  const h = loadHistory();
  if (!h[zyte.id]) h[zyte.id] = [];
  h[zyte.id].push({
    version: zyte.version,
    hash: zyte.hash,
    created_at: zyte.created_at
  });
  saveHistory(h);
}

function getHistory(id) {
  const h = loadHistory();
  return h[id] || [];
}

module.exports = { recordVersion, getHistory };
