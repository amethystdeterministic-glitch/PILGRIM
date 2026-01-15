export function renderMundo(containerId = "main") {
  const el = document.getElementById(containerId);
  if (!el) return;

  el.innerHTML = `
    <div style="display:flex;height:80vh;">
      <aside style="width:25%;border-right:1px solid #ccc;padding:10px;">
        <h3>MUNDO</h3>
        <ul id="mundo-channels">
          <li data-channel="general"># General</li>
          <li data-channel="post"># Post</li>
          <li data-channel="system"># System</li>
        </ul>
      </aside>

      <section style="flex:1;padding:10px;">
        <h3 id="mundo-title">General</h3>
        <div id="mundo-messages"></div>
      </section>
    </div>
  `;
}
