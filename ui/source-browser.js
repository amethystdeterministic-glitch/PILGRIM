export async function loadSourceBrowser(container) {
  container.innerHTML = `
    <div class="panel">
      <h2>Sources</h2>
      <div id="source-list" class="source-list">Loading…</div>
    </div>
  `;

  try {
    const res = await fetch('http://127.0.0.1:9190/source/list');
    const data = await res.json();

    const list = container.querySelector('#source-list');

    if (!data.sources || data.sources.length === 0) {
      list.innerHTML = `<div class="empty">No Sources yet. Genesis state.</div>`;
      return;
    }

    list.innerHTML = '';
    for (const src of data.sources) {
      const card = document.createElement('div');
      card.className = 'source-card';
      card.innerHTML = `
        <h3>${src.title}</h3>
        <p>${src.description || ''}</p>
        <div class="meta">
          <span>ID: ${src.id}</span>
          <span>Head: ${src.head || '—'}</span>
        </div>
      `;
      list.appendChild(card);
    }
  } catch (err) {
    container.innerHTML = `<div class="error">Failed to load Sources</div>`;
  }
}
