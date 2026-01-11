"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = path.join(__dirname, "..");

function hashFile(p) {
  const data = fs.readFileSync(p);
  return crypto.createHash("sha256").update(data).digest("hex");
}

function walk(dir, out = {}) {
  fs.readdirSync(dir).forEach(f => {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      walk(p, out);
    } else {
      out[p.replace(ROOT + "/", "")] = hashFile(p);
    }
  });
  return out;
}

const audit = walk(ROOT);
console.log(JSON.stringify(audit, null, 2));
