export function renderPipelineWithMundo(containerId = "main") {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <h2>PIPELINE</h2>
    <p>🟡 In Progress</p>

    <section>
      <h3>MUNDO</h3>
      <p>Unified communication workspace.</p>
      <p><em>Read-only scaffold.</em></p>
    </section>

    <section>
      <h3>TOOLS</h3>
      <ul>
        <li>FORGE — Workspace</li>
        <li>WRITE — Documents</li>
        <li>POST — Formal messages</li>
        <li>MATRIX — Spreadsheets</li>
        <li>MUNDO — Context</li>
      </ul>
    </section>
  `;
}
