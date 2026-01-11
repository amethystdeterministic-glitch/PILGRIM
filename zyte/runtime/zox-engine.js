"use strict";

const fs = require("fs");
const path = require("path");

const ZOX_STORE = path.join(__dirname, "../zox/zox.json");

function loadZox() {
  return JSON.parse(fs.readFileSync(ZOX_STORE, "utf8"));
}

function saveZox(data) {
  fs.writeFileSync(ZOX_STORE, JSON.stringify(data, null, 2));
}

function createZox(id, zyteId) {
  const zox = {
    id,
    zyte: zyteId,
    created_at: new Date().toISOString()
  };
  const all = loadZox();
  all.push(zox);
  saveZox(all);
  return zox;
}

function listZox() {
  return loadZox();
}

module.exports = { createZox, listZox };
