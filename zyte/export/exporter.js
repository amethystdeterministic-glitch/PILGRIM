"use strict";

const fs = require("fs");
const path = require("path");

function exportJSON(zyte) {
  return JSON.stringify(zyte, null, 2);
}

function exportMarkdown(zyte) {
  return `# ${zyte.title}\n\n${zyte.content}\n\n---\nID: ${zyte.id}\nVersion: ${zyte.version}\nCreated: ${zyte.created_at}\nHash: ${zyte.hash}\n`;
}

module.exports = { exportJSON, exportMarkdown };
