function debug(msg) {
  console.log("[PORTAL]", msg);
}

function bindNav() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  nav.onclick = (e) => {
    if (e.target.tagName !== "BUTTON") return;
    const route = e.target.dataset.route;
    debug("NAV -> " + route);

    if (route === "source") render(renderSourceHome);
    if (route === "pipeline") render(renderPipeline);
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

function renderSourceHome() {
  document.getElementById("main").innerHTML = `
    <h2>Amethyst Deterministic Ltd</h2>
    <p><strong>Runtime Status:</strong> CONNECTED</p>

    <h3>Who Built Amethyst</h3>
    <p>Amethyst is built and maintained by <strong>Amethyst Deterministic Ltd</strong>.</p>

    <h3>Who We Are</h3>
    <p>We are engineers, system designers, and operators who have worked inside modern digital workflows — and seen where they fail.</p>
    <p>Most problems with trust, compliance, and accountability are not caused by people, but by tools that allow history to be rewritten.</p>

    <h3>What We Aim to Achieve</h3>
    <ul>
      <li>What was decided?</li>
      <li>When did it change?</li>
      <li>Which version counts?</li>
    </ul>

    <p>Amethyst replaces editable history with enforced history — understandable, auditable, and fair by design.</p>
  `;
}

function renderPipeline() {
  document.getElementById("main").innerHTML = `
    <h2>PIPELINE</h2>
    <p>🟡 In Progress</p>
    <p><strong>FORGE</strong> — Set up the workspace.</p>
    <p><strong>WRITE</strong> — Documents (Word replacement).</p>
    <p><strong>POST</strong> — Email (Outlook replacement).</p>
    <p><strong>MATRIX</strong> — Spreadsheets (Excel replacement).</p>
    <p><strong>MUNDO</strong> — Chat + context.</p>
  `;
}

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
      <p><strong>Freeze</strong> locks a state.</p>
      <p><strong>Unfreeze</strong> resumes work from that state.</p>
      <p>Canon ensures no version drift.</p>

      <h3>Versioning</h3>
      <p>Every progression creates a new version.</p>
      <p>Canon versions remain immutable.</p>
    `;
  };
}

document.addEventListener("DOMContentLoaded", () => {
  debug("DOM READY");
  bindNav();
  render(renderSourceHome);
});
