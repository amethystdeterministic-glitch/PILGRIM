"use strict";

const crypto = require("crypto");

function hashZyte(zyte) {
  const payload = `${zyte.id}|${zyte.title}|${zyte.content}|${zyte.version}|${zyte.created_at}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

module.exports = { hashZyte };
