"use strict";

const fs = require("fs");
const path = require("path");
const { hashZyte } = require("./hash");
const { indexZyte } = require("./indexer");
const { recordVersion } = require("./history-engine");
const { enforce } = require("./dre-engine");

const STORE = path.join(__dirname, "../storage/zytes.json");
const LOG = path.join(__dirname, "../storage/zytes.log");

function load() {
  return JSON.parse(fs.readFileSync(STORE, "utf8"));
}

function save(data) {
  fs.writeFileSync(STORE, JSON.stringify(data, null, 2));
}

function appendLog(event) {
  fs.appendFileSync(LOG, JSON.stringify(event) + "\n");
}

function exists(id) {
  return load().some(z => z.id === id);
}

function create(id, title, content) {
  enforce("create", { id, title, content });

  if (exists(id)) throw new Error("immutable_id_violation");

  const zytes = load();
  const zyte = {
    id,
    title,
    content,
    version: 1,
    created_at: new Date().toISOString()
  };

  zyte.hash = hashZyte(zyte);

  zytes.push(zyte);
  save(zytes);
  appendLog({ type: "create", zyte });
  indexZyte(zyte);
  recordVersion(zyte);

  return zyte;
}

function update(id, title, content) {
  const zytes = load();
  const current = zytes.find(z => z.id === id);
  if (!current) throw new Error("not_found");

  enforce("update", { id, title, content }, current);

  const next = {
    id,
    title: title ?? current.title,
    content: content ?? current.content,
    version: current.version + 1,
    created_at: new Date().toISOString()
  };

  next.hash = hashZyte(next);

  const updated = zytes.map(z => (z.id === id ? next : z));
  save(updated);

  appendLog({ type: "update", from: current, to: next });
  indexZyte(next);
  recordVersion(next);

  return next;
}

function list() { return load(); }
function get(id) { return load().find(z => z.id === id) || null; }

module.exports = { create, update, list, get };
