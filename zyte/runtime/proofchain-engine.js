"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const CHAIN = path.join(__dirname, "../proofchain/chain.json");

function load() {
  return JSON.parse(fs.readFileSync(CHAIN, "utf8"));
}

function save(c) {
  fs.writeFileSync(CHAIN, JSON.stringify(c, null, 2));
}

function hash(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

function append(event) {
  const chain = load();
  const prev = chain.length ? chain[chain.length - 1].hash : "GENESIS";
  const entry = {
    index: chain.length,
    timestamp: new Date().toISOString(),
    prev,
    event,
  };
  entry.hash = hash(entry);
  chain.push(entry);
  save(chain);
  return entry;
}

function list() {
  return load();
}

module.exports = { append, list };
