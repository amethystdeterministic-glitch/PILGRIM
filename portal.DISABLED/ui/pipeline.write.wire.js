import { renderWriteShell } from "./write.shell.js";

export function renderPipelineWithWrite(containerId = "main") {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <h2>PIPELINE</h2>
    <p>🟡 In Progress</p>

    <section>
      <h3>WRITE</h3>
      <button id="open-write">Open WRITE</button>
    </section>
  `;

  document.getElementById("open-write").onclick = () =>
    renderWriteShell(containerId);
}
