(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function ensureMain() {
    let m = $("main");
    if (!m) {
      m = document.createElement("div");
      m.id = "main";
      document.body.appendChild(m);
    }
    return m;
  }

  function setMain(html) {
    ensureMain().innerHTML = html;
  }

  function route(r) {
    window.location.hash = "#" + (r || "source");
  }
  window.route = route;

  function renderSource() {
    setMain(`<h2>SOURCE</h2><p>Define origins.</p>`);
  }

  function renderPipeline() {
    setMain(`
      <h2>PIPELINE</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button data-route="pipeline/forge">FORGE</button>
        <button data-route="pipeline/write">WRITE</button>
        <button data-route="pipeline/post">POST</button>
        <button data-route="pipeline/matrix">MATRIX</button>
        <button data-route="pipeline/mundo">MUNDO</button>
        <button data-route="pipeline/canvas">CANVAS</button>
      </div>
    `);
  }

  function renderPipelineApp(app) {
    setMain(`
      <h2>${app.toUpperCase()}</h2>
      <p>App shell.</p>
      <button data-route="pipeline">Back</button>
    `);
  }

  function renderGuards() {
    setMain(`<h2>GUARDS</h2><p>Policy layer.</p>`);
  }

  function renderSettings() {
    setMain(`<h2>SETTINGS</h2><p>Configuration.</p>`);
  }

  // CORE = route, not page. Renders inside shell.
  function renderCore() {
    setMain(`
      <h2>CORE</h2>
      <p>System state surface.</p>
      <div style="display:flex;gap:10px;">
        <div class="card" style="padding:12px;border-radius:12px;">
          <strong>System</strong><div>Available</div>
        </div>
        <div class="card" style="padding:12px;border-radius:12px;">
          <strong>Source Head</strong><div>Pending</div>
        </div>
        <div class="card" style="padding:12px;border-radius:12px;">
          <strong>Verify</strong><div>Pending</div>
        </div>
      </div>
    `);
  }

  function render() {
    const h = (window.location.hash || "#source").replace("#", "");
    if (h === "source") return renderSource();
    if (h === "pipeline") return renderPipeline();
    if (h.startsWith("pipeline/")) return renderPipelineApp(h.split("/")[1]);
    if (h === "guards") return renderGuards();
    if (h === "settings") return renderSettings();
    if (h === "core") return renderCore();
    renderSource();
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-route]");
    if (!b) return;
    e.preventDefault();
    route(b.getAttribute("data-route"));
  });

  window.addEventListener("hashchange", render);
  document.addEventListener("DOMContentLoaded", render);
})();
