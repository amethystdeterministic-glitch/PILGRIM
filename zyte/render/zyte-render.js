"use strict";

function renderHTML(zyte) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${zyte.title}</title></head>
<body>
  <h1>${zyte.title}</h1>
  <article>${zyte.content}</article>
  <footer>v${zyte.version} • ${zyte.created_at}</footer>
</body>
</html>`;
}

module.exports = { renderHTML };
