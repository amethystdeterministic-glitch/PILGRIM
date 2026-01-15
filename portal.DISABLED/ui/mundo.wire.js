import { renderMundo } from "./mundo.shell.js";
import { initMundo } from "./mundo.logic.js";

export function openMundo(containerId = "main") {
  renderMundo(containerId);
  initMundo();
}
