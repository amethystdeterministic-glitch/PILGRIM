import { MUNDO_MESSAGES } from "./mundo.data.js";

export function initMundo() {
  const channels = document.getElementById("mundo-channels");
  const title = document.getElementById("mundo-title");
  const box = document.getElementById("mundo-messages");

  function renderChannel(name) {
    title.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    box.innerHTML = "";
    (MUNDO_MESSAGES[name] || []).forEach(m => {
      const div = document.createElement("div");
      div.style.marginBottom = "8px";
      div.textContent = `[${m.ts}] ${m.body}`;
      box.appendChild(div);
    });
  }

  channels.onclick = e => {
    if (e.target.tagName !== "LI") return;
    renderChannel(e.target.dataset.channel);
  };

  renderChannel("general");
}
