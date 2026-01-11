"use strict";

const { verify } = require("./signing-engine");

function verifyBundle(bundle) {
  if (!bundle || !bundle.signature) return false;
  const clone = Object.assign({}, bundle);
  delete clone.signature;
  return verify(clone, bundle.signature);
}

module.exports = { verifyBundle };
