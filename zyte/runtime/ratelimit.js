"use strict";

const fs = require("fs");
const path = require("path");

const LIMITS = path.join(__dirname, "../limits/limits.json");
const buckets = {};

function load() {
  return JSON.parse(fs.readFileSync(LIMITS, "utf8"));
}

function allow(ip) {
  const { rate_per_minute } = load();
  const now = Date.now();
  const windowMs = 60 * 1000;

  if (!buckets[ip]) buckets[ip] = [];
  buckets[ip] = buckets[ip].filter(t => now - t < windowMs);

  if (buckets[ip].length >= rate_per_minute) return false;
  buckets[ip].push(now);
  return true;
}

module.exports = { allow };
