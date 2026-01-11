"use strict";

const fs = require("fs");
const path = require("path");

const POLICIES = path.join(__dirname, "../dre/policies.json");

function loadPolicies() {
  return JSON.parse(fs.readFileSync(POLICIES, "utf8"));
}

function enforce(action, payload, current=null) {
  const p = loadPolicies()[action];
  if (!p) return true;

  if (p.required_fields) {
    for (const f of p.required_fields) {
      if (!payload[f]) throw new Error("dre_missing_field_" + f);
    }
  }

  if (p.immutable && current) {
    for (const f of p.immutable) {
      if (payload[f] && payload[f] !== current[f]) {
        throw new Error("dre_immutable_violation_" + f);
      }
    }
  }

  return true;
}

module.exports = { enforce };
