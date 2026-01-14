function debug(msg) {
  console.log("[PORTAL]", msg);
}

/* -------------------------
   NAV + RENDER (CANON)
-------------------------- */
function bindNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  nav.onclick = e => {
    if (e.target.tagName !== "BUTTON") return;
    const route = e.target.dataset.route;
    debug("NAV -> " + route);

    if (route === "source") render(renderSourceHome);
    if (route === "pipeline") render(renderPipeline);
    if (route === "mundo") render(renderMundo);
    if (route === "guards") render(renderGuards);
    if (route === "settings") render(renderSettings);
  };
}

function render(fn) {
  const main = document.getElementById("main");
  if (!main) return;
  main.innerHTML = "";
  fn();
}

/* -------------------------
   SOURCE
-------------------------- */
function renderSourceHome() {
  document.getElementById("main").innerHTML = `
    <h2>Amethyst Deterministic Ltd</h2>
    <p><strong>Runtime Status:</strong> CONNECTED</p>

    <h3>Who Built Amethyst</h3>
    <p>Built and maintained by <strong>Amethyst Deterministic Ltd</strong>.</p>

    <h3>What This Is</h3>
    <p>Amethyst is a deterministic system delivered through the Portal first.</p>
    <p>History is enforced, not rewritten.</p>
  `;
}

/* -------------------------
   PIPELINE (discoverability)
-------------------------- */
function renderPipeline() {
  document.getElementById("main").innerHTML = `
    <h2>PIPELINE</h2>
    <p>🟡 In Progress</p>

    <section>
      <h3>Apps</h3>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        <button id="open-forge">FORGE</button>
        <button id="open-write">WRITE</button>
        <button id="open-post">POST</button>
        <button id="open-matrix">MATRIX</button>
        <button id="open-mundo">MUNDO</button>
      </div>
      <p style="margin-top:10px;"><em>These are v0 surfaces. Real capability arrives incrementally under Freeze discipline.</em></p>
    </section>

    <section style="margin-top:16px;">
      <h3>Flow</h3>
      <ul>
        <li>FORGE — define Source</li>
        <li>WRITE — documents</li>
        <li>POST — formal messages (email replacement)</li>
        <li>MATRIX — spreadsheets</li>
        <li>MUNDO — unified communication workspace</li>
      </ul>
    </section>
  `;

  document.getElementById("open-forge").onclick = () => render(renderForge);
  document.getElementById("open-write").onclick = () => render(renderWrite);
  document.getElementById("open-post").onclick = () => render(renderPost);
  document.getElementById("open-matrix").onclick = () => render(renderMatrix);
  document.getElementById("open-mundo").onclick = () => render(renderMundo);
}

/* -------------------------
   FORGE / WRITE / POST / MATRIX (v0 visible)
-------------------------- */
function renderForge() {
  document.getElementById("main").innerHTML = `
    <h2>FORGE</h2>
    <p>Source design stage.</p>
    <p><em>Publishing locked until next phase.</em></p>
  `;
}

function renderWrite() {
  document.getElementById("main").innerHTML = `
    <h2>WRITE</h2>
    <p>Document editor (Word / Docs replacement).</p>
    <p><em>v0 scaffold — editing surface comes next.</em></p>
  `;
}

function renderPost() {
  document.getElementById("main").innerHTML = `
    <h2>POST</h2>
    <p>Formal messages (Outlook replacement).</p>
    <p><em>v0 scaffold — Mundo will surface POST messages as a channel.</em></p>
  `;
}

function renderMatrix() {
  document.getElementById("main").innerHTML = `
    <h2>MATRIX</h2>
    <p>Spreadsheet engine (Excel / Sheets replacement).</p>
    <p><em>v0 scaffold — deterministic grid comes next.</em></p>

    <table border="1" cellpadding="6" style="margin-top:10px;">
      <tr><th>A</th><th>B</th></tr>
      <tr><td>1</td><td>2</td></tr>
    </table>
  `;
}

/* -------------------------
   MUNDO (usable v0)
-------------------------- */
const MUNDO_MESSAGES = {
  general: [
    { id: "1", ts: "2026-01-01T10:00Z", src: "chat", body: "Welcome to Mundo." },
    { id: "2", ts: "2026-01-01T10:05Z", src: "chat", body: "All communication lives here." }
  ],
  post: [
    { id: "3", ts: "2026-01-01T11:00Z", src: "post", body: "Subject: Hello\nThis is a POST message." }
  ],
  system: [
    { id: "4", ts: "2026-01-01T12:00Z", src: "system", body: "Runtime connected. GREEN state." }
  ]
};

function renderMundo() {
  document.getElementById("main").innerHTML = `
    <div style="display:flex;gap:10px;min-height:70vh;">
      <aside style="width:28%;border-right:1px solid #ccc;padding:10px;">
        <h2>MUNDO</h2>
        <p style="margin-top:-8px;"><em>Unified communication workspace</em></p>

        <div id="mundo-channels" style="display:flex;flex-direction:column;gap:8px;margin-top:12px;">
          <button data-channel="general"># General</button>
          <button data-channel="post"># Post</button>
          <button data-channel="system"># System</button>
        </div>
      </aside>

      <section style="flex:1;padding:10px;">
        <h3 id="mundo-title">General</h3>
        <div id="mundo-messages" style="display:flex;flex-direction:column;gap:8px;"></div>
      </section>
    </div>
  `;

  function renderChannel(name) {
    const title = document.getElementById("mundo-title");
    const box = document.getElementById("mundo-messages");
    title.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    box.innerHTML = "";

    (MUNDO_MESSAGES[name] || []).forEach(m => {
      const div = document.createElement("div");
      div.style.padding = "8px";
      div.style.border = "1px solid #ddd";
      div.textContent = `[${m.ts}] ${m.body}`;
      box.appendChild(div);
    });
  }

  document.getElementById("mundo-channels").onclick = e => {
    if (e.target.tagName !== "BUTTON") return;
    renderChannel(e.target.dataset.channel);
  };

  renderChannel("general");
}

/* -------------------------
   GUARDS / SETTINGS
-------------------------- */
function renderGuards() {
  document.getElementById("main").innerHTML = `
    <h2>GUARDS</h2>
    <ul>
      <li><strong>FamilyGuard</strong> — Pro</li>
      <li><strong>Enterprise Guards</strong> — Licensed</li>
    </ul>
  `;
}

function renderSettings() {
  document.getElementById("main").innerHTML = `
    <h2>SETTINGS</h2>
    <button id="userGuide">User Guide</button>
  `;

  document.getElementById("userGuide").onclick = () => {
    document.getElementById("main").innerHTML = `
      <h2>User Guide</h2>

      <h3>States</h3>
      <ul>
        <li>🔴 RED — New / draft / outline</li>
        <li>🟡 YELLOW — Active, in progress</li>
        <li>🟢 GREEN — Canonical, ready or released</li>
      </ul>

      <h3>Freeze / Unfreeze</h3>
      <p><strong>Freeze</strong> locks state.</p>
      <p><strong>Unfreeze</strong> resumes from the last frozen state.</p>
      <p><strong>Canon</strong> prevents version drift.</p>
    `;
  };
}

/* -------------------------
   BOOT
-------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  debug("DOM READY");
  bindNav();
  render(renderSourceHome);
});
