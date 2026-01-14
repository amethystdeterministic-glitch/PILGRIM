export function renderWriteShell(containerId = "main") {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <h2>WRITE</h2>
    <p>Document editor (Word / Docs replacement).</p>
    <p><em>Read-only scaffold.</em></p>

    <section>
      <h3>Lifecycle</h3>
      <ul>
        <li>Draft → Active → Frozen (Canon)</li>
      </ul>
    </section>
  `;
}
