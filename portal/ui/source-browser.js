export async function loadSourceBrowser(container) {
  container.innerHTML = '<h2>Sources</h2><p>Loading…</p>';

  try {
    const res = await fetch('http://127.0.0.1:9190/source/list');
    const data = await res.json();

    if (!data.ok || data.count === 0) {
      container.innerHTML = `
        <div class="panel">
          <h2>Genesis</h2>
          <p>No Sources exist yet.</p>
        </div>
      `;
      return;
    }

    const items = data.sources.map(s => `
      <div class="source-card">
        <strong>${s.title || s.id}</strong>
        <div class="meta">Head: ${s.head}</div>
        <div class="meta">Created: ${s.created_at}</div>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="panel">
        <h2>Sources (${data.count})</h2>
        ${items}
      </div>
    `;
  } catch (err) {
    container.innerHTML = `
      <div class="panel error">
        <h2>Error</h2>
        <p>Unable to load Sources.</p>
      </div>
    `;
  }
}
