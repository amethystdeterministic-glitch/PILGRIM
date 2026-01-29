import { legalMovesFor, applyMove, gameStatus } from "./rules.js";
import { renderBoard } from "./render.js";
import { loadState, saveState, resetState } from "./state.js";
import { loadHistory, pushSnapshot, undo, redo, clearHistory } from "./history.js";
import { exportGame, importGameFromFile } from "./tools.js";

export function boot(){
  const root = document.getElementById("chessRoot");
  if(!root) throw new Error("Missing chessRoot");

  // HUD + Banner container
  if(!document.getElementById("hud")){
    const hud = document.createElement("div");
    hud.id = "hud";
    hud.style.cssText = "display:flex;gap:10px;align-items:center;justify-content:space-between;margin:12px 0;color:rgba(255,255,255,.92);flex-wrap:wrap";
    hud.innerHTML = `
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <b>CHESS</b>
        <span id="turn" style="color:rgba(176,176,208,.95)"></span>
        <span id="status" style="color:rgba(176,176,208,.95)"></span>
        <span id="hist" style="color:rgba(176,176,208,.75)"></span>
      </div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
        <button id="btnExport" class="dtnBtn ghost">EXPORT</button>
        <label class="dtnBtn ghost" style="cursor:pointer">
          IMPORT
          <input id="fileImport" type="file" accept="application/json" style="display:none" />
        </label>
        <button id="btnUndo" class="dtnBtn">UNDO</button>
        <button id="btnRedo" class="dtnBtn">REDO</button>
        <button id="btnReset" class="dtnBtn">RESET</button>
      </div>
    `;
    root.parentElement.insertBefore(hud, root);

    const banner = document.createElement("div");
    banner.id = "banner";
    banner.style.cssText = "display:none;margin:10px 0;padding:10px 12px;border:1px solid rgba(122,60,255,.35);background:rgba(122,60,255,.10);border-radius:14px;color:#fff;font-weight:800;letter-spacing:.08em";
    root.parentElement.insertBefore(banner, root);
  }

  // CSS once
  if(!document.getElementById("btnCss")){
    const s = document.createElement("style");
    s.id="btnCss";
    s.textContent = `
      .dtnBtn{border:1px solid rgba(122,60,255,.35);background:rgba(122,60,255,.14);color:#fff;padding:8px 10px;border-radius:10px;font-weight:800;letter-spacing:.08em}
      .dtnBtn.ghost{background:transparent}
      .dtnBtn:disabled{opacity:.45}
      .sq.sel{outline:2px solid rgba(122,60,255,.95); outline-offset:2px}
      .sq.hint{box-shadow:0 0 0 2px rgba(122,60,255,.35) inset}
      .sq.cap{box-shadow:0 0 0 2px rgba(255,90,180,.45) inset}
    `;
    document.head.appendChild(s);
  }

  const btnUndo = document.getElementById("btnUndo");
  const btnRedo = document.getElementById("btnRedo");
  const btnReset = document.getElementById("btnReset");
  const btnExport = document.getElementById("btnExport");
  const fileImport = document.getElementById("fileImport");
  const banner = document.getElementById("banner");

  let state = loadState();
  let selected = null;
  let legal = [];

  function historyCounts(){
    const h = loadHistory();
    return { past: h.past.length, future: h.future.length };
  }

  function setBanner(text){
    if(!text){
      banner.style.display = "none";
      banner.textContent = "";
      return;
    }
    banner.style.display = "block";
    banner.textContent = text;
  }

  function updateHud(){
    const turn = document.getElementById("turn");
    const st = document.getElementById("status");
    const hist = document.getElementById("hist");
    turn.textContent = `• TURN ${state.turn}`;

    const g = gameStatus(state.board, state.turn);
    st.textContent = `• ${g.status}`;

    // Banner (best-effort based on status text)
    const up = String(g.status || "").toUpperCase();
    if(up.includes("CHECKMATE")) setBanner("CHECKMATE");
    else if(up.includes("STALEMATE")) setBanner("STALEMATE");
    else if(up.includes("CHECK")) setBanner("CHECK");
    else setBanner("");

    const hc = historyCounts();
    hist.textContent = `• H ${hc.past}/${hc.future}`;

    btnUndo.disabled = hc.past === 0;
    btnRedo.disabled = hc.future === 0;
  }

  function paintHighlights(){
    document.querySelectorAll(".sq").forEach(el => el.classList.remove("sel","hint","cap"));
    if(!selected) return;
    const sel = document.querySelector(`.sq[data-r="${selected.r}"][data-c="${selected.c}"]`);
    if(sel) sel.classList.add("sel");
    for(const m of legal){
      const t = document.querySelector(`.sq[data-r="${m.to.r}"][data-c="${m.to.c}"]`);
      if(t) t.classList.add(m.capture ? "cap" : "hint");
    }
  }

  function hookSquares(){
    document.querySelectorAll(".sq").forEach(el => {
      el.onclick = () => {
        const r = parseInt(el.dataset.r,10);
        const c = parseInt(el.dataset.c,10);

        if(selected){
          const chosen = legal.find(m => m.to.r===r && m.to.c===c);
          if(chosen){
            pushSnapshot({ board: state.board, turn: state.turn });

            state.board = applyMove(state.board, chosen);
            state.turn = (state.turn==="W") ? "B" : "W";
            selected = null;
            legal = [];

            saveState(state);
            rerender();
            return;
          }
        }

        const piece = state.board[r][c];
        if(!piece){ selected=null; legal=[]; paintHighlights(); return; }
        if(piece[0] !== state.turn){ selected=null; legal=[]; paintHighlights(); return; }

        selected = {r,c};
        legal = legalMovesFor(state.board, r, c, state.turn);
        paintHighlights();
      };
    });
  }

  function rerender(){
    renderBoard(root, state);
    hookSquares();
    paintHighlights();
    updateHud();
  }

  btnUndo.onclick = () => {
    const res = undo({ board: state.board, turn: state.turn });
    state.board = res.state.board;
    state.turn = res.state.turn;
    selected=null; legal=[];
    saveState(state);
    rerender();
  };

  btnRedo.onclick = () => {
    const res = redo({ board: state.board, turn: state.turn });
    state.board = res.state.board;
    state.turn = res.state.turn;
    selected=null; legal=[];
    saveState(state);
    rerender();
  };

  btnReset.onclick = () => {
    if(!confirm("Reset chess state + history?")) return;
    clearHistory();
    resetState();
    location.reload();
  };

  btnExport.onclick = () => exportGame();

  fileImport.onchange = async () => {
    const f = fileImport.files && fileImport.files[0];
    fileImport.value = "";
    if(!f) return;
    try{
      await importGameFromFile(f);
    }catch(e){
      alert("IMPORT FAILED: " + (e && e.message ? e.message : "unknown error"));
    }
  };

  rerender();
}

/* === DTN PATCH: B3C enhance header (skin + theme) === */
import { enhanceHeader } from "./ui_enhance.js";
try { enhanceHeader(); } catch(e) {}
/* === END PATCH === */
