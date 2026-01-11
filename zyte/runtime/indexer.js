"use strict";

const fs = require("fs");
const path = require("path");

const INDEX = path.join(__dirname, "../index/index.json");

function loadIndex() {
  return JSON.parse(fs.readFileSync(INDEX, "utf8"));
}

function saveIndex(idx) {
  fs.writeFileSync(INDEX, JSON.stringify(idx, null, 2));
}

function indexZyte(zyte) {
  const idx = loadIndex();
  const tokens = `${zyte.title} ${zyte.content}`.toLowerCase().split(/\W+/).filter(Boolean);
  tokens.forEach(t => {
    if (!idx[t]) idx[t] = [];
    if (!idx[t].includes(zyte.id)) idx[t].push(zyte.id);
  });
  saveIndex(idx);
}

function search(term) {
  const idx = loadIndex();
  return idx[term.toLowerCase()] || [];
}

module.exports = { indexZyte, search };
