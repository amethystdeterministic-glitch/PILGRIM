(() => {
  "use strict";

  const main = () => document.getElementById("main");

  function setMain(html) {
    const el = main();
    if (!el) return;
    el.innerHTML = html;
  }

  function route(to) {
    window.location.hash = "#" + to;
    render(to);
  }

  function currentRoute() {
    return window.location.hash.replace("#", "") || "source";
  }

  function render(route) {
    if (route === "source") renderSource();
    else if (route === "pipeline") renderPipeline();
    else if (route === "guards") renderGuards();
    else if (route === "settings") renderSettings();
    else if (route === "forge") renderForge();
    else if (route === "write") renderWrite();
    else if (route === "post") renderPost();
    else if (route === "matrix") renderMatrix();
    else if (route === "mundo") renderMundo();
    else if (route === "canvas") renderCanvas();
    else renderSource();
  }

  // -------- RENDERS --------

  function renderSource() {
    setMain(`<h2>SOURCE</h2><p>Define origins.</p>`);
  }

  function renderPipeline() {
    setMain(`
      <h2>PIPELINE</h2>
      <p>In Progress</p>
      <div>
        <button id="open-forge">FORGE</button>
        <button id="open-write">WRITE</button>
        <button id="open-post">POST</button>
        <button id="open-matrix">MATRIX</button>
        <button id="open-mundo">MUNDO</button>
        <button id="open-canvas">CANVAS</button>
      </div>
    `);

    document.getElementById("open-forge").onclick  = () => route("forge");
    document.getElementById("open-write").onclick  = () => route("write");
    document.getElementById("open-post").onclick   = () => route("post");
    document.getElementById("open-matrix").onclick = () => route("matrix");
    document.getElementById("open-mundo").onclick  = () => route("mundo");
    document.getElementById("open-canvas").onclick = () => route("canvas");
  }

  function renderGuards() {
    setMain(`<h2>GUARDS</h2><p>Policy layer.</p>`);
  }

  function renderSettings() {
    setMain(`<h2>SETTINGS</h2><p>Configuration.</p>`);
  }

  function renderForge() {
    setMain(`<h2>FORGE</h2><p>Define Source.</p>`);
  }

  function renderWrite() {
    setMain(`<h2>WRITE</h2><p>Documents.</p>`);
  }

  function renderPost() {
    setMain(`<h2>POST</h2><p>Formal messages.</p>`);
  }

  function renderMatrix() {
    setMain(`<h2>MATRIX</h2><p>Spreadsheets.</p>`);
  }

  function renderMundo() {
    setMain(`<h2>MUNDO</h2><p>Unified communications.</p>`);
  }

  function renderCanvas() {
    setMain(`<h2>CANVAS</h2><p>Visual workspace.</p>`);
  }

  // -------- INIT --------

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-route]").forEach(btn => {
      btn.onclick = () => route(btn.dataset.route);
    });

    render(currentRoute());
  });
})();
