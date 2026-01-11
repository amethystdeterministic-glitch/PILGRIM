"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const KEYS = path.join(__dirname, "../signing/keys.json");

function loadKey() {
  return JSON.parse(fs.readFileSync(KEYS, "utf8")).secret;
}

function sign(payload) {
  const key = loadKey();
  return crypto.createHmac("sha256", key)
    .update(JSON.stringify(payload))
    .digest("hex");
}

function verify(payload, signature) {
  return sign(payload) === signature;
}

module.exports = { sign, verify };
