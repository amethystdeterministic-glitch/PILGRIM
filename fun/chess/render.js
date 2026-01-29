import { renderPiece } from "./pieces.js";
import { applyTheme } from "./theme.js";

export function renderBoard(root, state){
  applyTheme();

  root.innerHTML = "";
  root.style.cssText = "display:grid;grid-template-columns:repeat(8,1fr);gap:6px;max-width:520px;margin:0 auto";

  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const sq = document.createElement("div");
      const dark = ((r+c)%2===1);
      sq.className = "sq";
      sq.dataset.r = String(r);
      sq.dataset.c = String(c);

      sq.style.cssText = `
        aspect-ratio:1/1;
        display:flex;align-items:center;justify-content:center;
        border-radius:14px;
        border:1px solid rgba(122,60,255,.18);
        background:${dark ? "var(--sqDark)" : "var(--sqLight)"};
        user-select:none;
        touch-action:manipulation;
      `;

      const p = state.board[r][c];
      sq.innerHTML = renderPiece(p);

      root.appendChild(sq);
    }
  }
}
