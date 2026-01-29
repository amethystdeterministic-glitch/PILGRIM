import { getSkin, setSkin } from "./pieces.js";
import { getTheme, setTheme, applyTheme } from "./theme.js";

export function enhanceHeader(){
  const hud = document.getElementById("hud");
  if(!hud) return;

  // Prevent duplicates
  if(document.getElementById("skinSel")) return;

  const wrap = document.createElement("div");
  wrap.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;align-items:center";

  wrap.innerHTML = `
    <select id="skinSel" class="dtnBtn ghost" title="Piece Skin">
      <option value="AMETHYST">AMETHYST</option>
      <option value="CLASSIC">CLASSIC</option>
    </select>
    <select id="themeSel" class="dtnBtn ghost" title="Theme">
      <option value="AMETHYST_DARK">AMETHYST_DARK</option>
      <option value="MONO">MONO</option>
      <option value="PAPER">PAPER</option>
    </select>
  `;

  // Put next to the right-side buttons
  const right = hud.querySelector("div:last-child");
  if(right) right.prepend(wrap);

  const skinSel = document.getElementById("skinSel");
  const themeSel = document.getElementById("themeSel");

  skinSel.value = getSkin();
  themeSel.value = getTheme();

  skinSel.onchange = () => { setSkin(skinSel.value); location.reload(); };
  themeSel.onchange = () => { setTheme(themeSel.value); applyTheme(); location.reload(); };
}
