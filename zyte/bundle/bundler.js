"use strict";

function bundle(zyte, history, proof, zox) {
  return {
    zyte,
    history,
    proof,
    zox,
    bundled_at: new Date().toISOString()
  };
}

module.exports = { bundle };
