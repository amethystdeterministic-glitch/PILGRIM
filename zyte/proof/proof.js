"use strict";

const crypto = require("crypto");

function deterministicProof(payload) {
  return crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
}

module.exports = { deterministicProof };
