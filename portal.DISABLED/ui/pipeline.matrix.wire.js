import { renderMatrixShell } from "./matrix.shell.js";

export function renderPipelineWithMatrix(containerId = "main") {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <h2>PIPELINE</h2>
    <p>🟡 In Progress</p>

    <section>
      <h3>MATRIX</h3>
      <button id="open-matrix">Open MATRIX</button>
    </section>
  `;

  document.getElementById("open-matrix").onclick = () =>
    renderMatrixShell(containerId);
}
