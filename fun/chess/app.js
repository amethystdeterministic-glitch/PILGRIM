
function renderPiece(code){
  if(!code) return "";
  const side = code[0];
  const kind = code[1];
  const label = kind; // deterministic symbol
  return `<div class="piece ${side} ${kind}">${label}</div>`;
}

import { renderBoard } from "./render.js";
import { getSkin, setSkin } from "./pieces.js";
import { getTheme, setTheme, applyTheme } from "./theme.js";
import { boardToFEN, fenToBoard } from "./fen.js";

const STORE_KEY = "amethyst_chess_v1_state";

// ===== Deterministic helpers
function nowIso(){ return new Date().toISOString(); }
function cloneBoard(b){ return b.map(r => r.slice()); }
function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8; }
function sideOf(p){ return p ? p[0] : null; }
function kindOf(p){ return p ? p[1] : null; }
function enemy(a,b){ return a && b && sideOf(a) !== sideOf(b); }
function sameSide(a,b){ return a && b && sideOf(a) === sideOf(b); }

// ===== Initial position
function initialBoard(){
  return [
    ["BR","BN","BB","BQ","BK","BB","BN","BR"],
    ["BP","BP","BP","BP","BP","BP","BP","BP"],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ["WP","WP","WP","WP","WP","WP","WP","WP"],
    ["WR","WN","WB","WQ","WK","WB","WN","WR"],
  ];
}

function seedState(){
  return {
    version: "1.0.0",
    created_at: nowIso(),
    turn: "W",
    board: initialBoard(),
    selected: null,
    lastMove: null,
    history: [],          // {move, prevState}
    pgn: [],              // simple SAN-ish list
    status: "READY"       // READY | CHECK | MATE | STALEMATE
  };
}

function loadState(){
  const raw = localStorage.getItem(STORE_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch(e){}
  }
  const s = seedState();
  saveState(s);
  return s;
}

function saveState(s){
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}

// ===== Move generation (legal)
function findKing(board, side){
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p = board[r][c];
    if(p && p === (side+"K")) return {r,c};
  }
  return null;
}

function attacksSquare(board, attackerSide, tr, tc){
  // Return true if attackerSide attacks target square
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p = board[r][c];
    if(!p || sideOf(p) !== attackerSide) continue;
    const moves = pseudoMoves(board, r, c, {attacks:true});
    if(moves.some(m => m.r === tr && m.c === tc)) return true;
  }
  return false;
}

function pseudoMoves(board, r, c, opt={}){
  const p = board[r][c];
  if(!p) return [];
  const s = sideOf(p);
  const k = kindOf(p);
  const out = [];
  const dir = (s === "W") ? -1 : 1;

  const push = (rr,cc) => { if(inBounds(rr,cc)) out.push({r:rr,c:cc}); };

  if(k === "P"){
    // attacks
    push(r+dir, c-1);
    push(r+dir, c+1);
    if(opt.attacks) return out.filter(m => inBounds(m.r,m.c));

    // forward
    out.length = 0;
    const f1 = {r:r+dir, c};
    if(inBounds(f1.r,f1.c) && !board[f1.r][f1.c]) out.push(f1);

    // double from start
    const startRank = (s === "W") ? 6 : 1;
    const f2 = {r:r+2*dir, c};
    if(r === startRank && !board[f1.r][f1.c] && inBounds(f2.r,f2.c) && !board[f2.r][f2.c]){
      out.push(f2);
    }
    // captures
    const capL = {r:r+dir, c:c-1};
    const capR = {r:r+dir, c:c+1};
    if(inBounds(capL.r,capL.c) && enemy(p, board[capL.r][capL.c])) out.push(capL);
    if(inBounds(capR.r,capR.c) && enemy(p, board[capR.r][capR.c])) out.push(capR);

    return out;
  }

  if(k === "N"){
    const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    for(const [dr,dc] of deltas){
      const rr=r+dr, cc=c+dc;
      if(!inBounds(rr,cc)) continue;
      const t = board[rr][cc];
      if(!t || enemy(p,t)) out.push({r:rr,c:cc});
      if(opt.attacks && inBounds(rr,cc)) out.push({r:rr,c:cc});
    }
    // If attacks-only, allow squares even if occupied by same side (for attack map)
    if(opt.attacks){
      return [...new Map(out.map(m=>[m.r+","+m.c,m])).values()];
    }
    return out;
  }

  const rays = [];
  if(k === "B" || k === "Q") rays.push([-1,-1],[-1,1],[1,-1],[1,1]);
  if(k === "R" || k === "Q") rays.push([-1,0],[1,0],[0,-1],[0,1]);

  if(rays.length){
    for(const [dr,dc] of rays){
      let rr=r+dr, cc=c+dc;
      while(inBounds(rr,cc)){
        const t = board[rr][cc];
        if(!t){
          out.push({r:rr,c:cc});
        }else{
          if(enemy(p,t)) out.push({r:rr,c:cc});
          if(opt.attacks) out.push({r:rr,c:cc});
          break;
        }
        rr+=dr; cc+=dc;
      }
    }
    if(opt.attacks){
      return [...new Map(out.map(m=>[m.r+","+m.c,m])).values()];
    }
    return out;
  }

  if(k === "K"){
    for(let dr=-1;dr<=1;dr++) for(let dc=-1;dc<=1;dc++){
      if(dr===0 && dc===0) continue;
      const rr=r+dr, cc=c+dc;
      if(!inBounds(rr,cc)) continue;
      const t = board[rr][cc];
      if(!t || enemy(p,t)) out.push({r:rr,c:cc});
      if(opt.attacks) out.push({r:rr,c:cc});
    }
    if(opt.attacks){
      return [...new Map(out.map(m=>[m.r+","+m.c,m])).values()];
    }
    return out;
  }

  return out;
}

function legalMoves(state, r, c){
  const board = state.board;
  const p = board[r][c];
  if(!p) return [];
  if(sideOf(p) !== state.turn) return [];

  const candidates = pseudoMoves(board, r, c);
  const out = [];

  for(const m of candidates){
    const nb = cloneBoard(board);
    // apply move
    nb[m.r][m.c] = p;
    nb[r][c] = null;

    // auto promote pawn to queen at back rank
    if(kindOf(p) === "P"){
      if((sideOf(p)==="W" && m.r===0) || (sideOf(p)==="B" && m.r===7)){
        nb[m.r][m.c] = sideOf(p)+"Q";
      }
    }

    // legality: own king not in check
    const kpos = findKing(nb, state.turn);
    if(!kpos) continue;
    if(attacksSquare(nb, state.turn === "W" ? "B" : "W", kpos.r, kpos.c)) continue;

    out.push(m);
  }
  return out;
}

function allLegalMoves(state, side){
  const savedTurn = state.turn;
  state.turn = side;
  const moves = [];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const p = state.board[r][c];
    if(p && sideOf(p)===side){
      const ms = legalMoves(state,r,c);
      for(const m of ms) moves.push({from:{r,c}, to:m});
    }
  }
  state.turn = savedTurn;
  return moves;
}

function computeStatus(state){
  const side = state.turn;
  const k = findKing(state.board, side);
  if(!k) return "READY";
  const inCheck = attacksSquare(state.board, side==="W" ? "B":"W", k.r, k.c);
  const any = allLegalMoves(state, side).length > 0;
  if(inCheck && !any) return "MATE";
  if(!inCheck && !any) return "STALEMATE";
  if(inCheck) return "CHECK";
  return "READY";
}

// ===== SAN-ish notation (minimal)
function squareName(r,c){
  const file = "abcdefgh"[c];
  const rank = String(8-r);
  return file+rank;
}
function pieceLetter(p){
  const k = kindOf(p);
  if(k==="P") return "";
  return ({K:"K",Q:"Q",R:"R",B:"B",N:"N"}[k]||"");
}
function moveText(board, from, to){
  const p = board[from.r][from.c];
  const tgt = board[to.r][to.c];
  const cap = tgt ? "x" : "";
  const lead = pieceLetter(p);
  if(kindOf(p)==="P" && cap){
    return "abcdefgh"[from.c] + "x" + squareName(to.r,to.c);
  }
  return lead + cap + squareName(to.r,to.c);
}

// ===== UI
const el = (id)=>document.getElementById(id);
const boardRoot = el("board");
const statusEl  = el("status");
const turnEl    = el("turn");
const pgnEl     = el("pgn");
const skinSel   = el("skinSel");
const themeSel  = el("themeSel");
const btnNew    = el("btnNew");
const btnUndo   = el("btnUndo");
const btnShare  = el("btnShare");
const btnImport = el("btnImport");
const btnExport = el("btnExport");
const btnReset  = el("btnReset");

let S = loadState();

function syncTop(){
  applyTheme();
  turnEl.textContent = (S.turn==="W") ? "WHITE" : "BLACK";
  const st = computeStatus(S);
  S.status = st;
  statusEl.textContent = st;
  pgnEl.textContent = S.pgn.join(" ");
  saveState(S);
}

function clearHighlights(){
  document.querySelectorAll(".sq").forEach(x=>{
    x.style.outline = "none";
    x.style.boxShadow = "none";
  });
}

function highlightSquare(r,c, kind){
  const idx = r*8+c;
  const sq = document.querySelectorAll(".sq")[idx];
  if(!sq) return;
  if(kind==="from"){
    sq.style.outline = "2px solid rgba(122,60,255,.75)";
    sq.style.boxShadow = "0 0 0 6px rgba(122,60,255,.10)";
  }else{
    sq.style.outline = "2px solid rgba(122,60,255,.45)";
  }
}

function render(){
  renderBoard(boardRoot, S);
  wireSquares();
  clearHighlights();
  if(S.lastMove){
    highlightSquare(S.lastMove.from.r,S.lastMove.from.c,"from");
    highlightSquare(S.lastMove.to.r,S.lastMove.to.c,"to");
  }
  if(S.selected){
    highlightSquare(S.selected.r,S.selected.c,"from");
    const moves = legalMoves(S, S.selected.r, S.selected.c);
    for(const m of moves) highlightSquare(m.r,m.c,"to");
  }
  syncTop();
}

function wireSquares(){
  document.querySelectorAll(".sq").forEach(sq=>{
    sq.onclick = () => {
      const r = Number(sq.dataset.r);
      const c = Number(sq.dataset.c);
      onSquare(r,c);
    };
  });
}

function onSquare(r,c){
  const p = S.board[r][c];

  // selecting a piece
  if(!S.selected){
    if(p && sideOf(p)===S.turn){
      S.selected = {r,c};
      saveState(S);
      render();
    }
    return;
  }

  // reselect another own piece
  if(p && sideOf(p)===S.turn){
    S.selected = {r,c};
    saveState(S);
    render();
    return;
  }

  // attempt move
  const from = S.selected;
  const moves = legalMoves(S, from.r, from.c);
  const ok = moves.find(m => m.r===r && m.c===c);
  if(!ok){
    // invalid -> clear selection
    S.selected = null;
    saveState(S);
    render();
    return;
  }

  // push history snapshot (forward-only undo)
  const prev = {
    turn: S.turn,
    board: cloneBoard(S.board),
    lastMove: S.lastMove,
    pgn: S.pgn.slice(),
    status: S.status
  };

  // notation before move (uses current board)
  const txt = moveText(S.board, from, ok);

  // apply
  const moving = S.board[from.r][from.c];
  S.board[ok.r][ok.c] = moving;
  S.board[from.r][from.c] = null;

  // promote pawn auto-queen
  if(kindOf(moving)==="P"){
    if((sideOf(moving)==="W" && ok.r===0) || (sideOf(moving)==="B" && ok.r===7)){
      S.board[ok.r][ok.c] = sideOf(moving)+"Q";
    }
  }

  S.lastMove = {from, to:{r:ok.r,c:ok.c}, at: nowIso()};
  S.selected = null;

  // turn swap
  S.turn = (S.turn==="W") ? "B" : "W";

  // status markers (+ / #)
  const st = computeStatus(S);
  let suffix = "";
  if(st==="CHECK") suffix = "+";
  if(st==="MATE") suffix = "#";
  S.pgn.push(txt + suffix);

  S.history.push({ move: {from, to:{r:ok.r,c:ok.c}}, prev });
  saveState(S);
  render();
}

// ===== Controls
skinSel.value = getSkin();
themeSel.value = getTheme();

skinSel.onchange = () => { setSkin(skinSel.value); render(); };
themeSel.onchange = () => { setTheme(themeSel.value); render(); };

btnNew.onclick = () => {
  S = seedState();
  saveState(S);
  render();
};

btnUndo.onclick = () => {
  const h = S.history.pop();
  if(!h){ return; }
  const p = h.prev;
  S.turn = p.turn;
  S.board = cloneBoard(p.board);
  S.lastMove = p.lastMove;
  S.pgn = p.pgn.slice();
  S.status = p.status;
  S.selected = null;
  saveState(S);
  render();
};

btnExport.onclick = () => {
  const payload = {
    exported_at: nowIso(),
    app: "Amethyst Chess",
    version: S.version,
    pgn: S.pgn.join(" "),
    fen: boardToFEN(S.board, S.turn),
    moves: S.history.map(x => ({
      from: squareName(x.move.from.r, x.move.from.c),
      to: squareName(x.move.to.r, x.move.to.c),
    }))
  };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "amethyst_chess_export.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

btnReset.onclick = () => {
  if(!confirm("Reset local chess state?")) return;
  localStorage.removeItem(STORE_KEY);
  S = seedState();
  saveState(S);
  render();
};

btnShare.onclick = async () => {
  // Deterministic share: encode FEN in URL hash (no server required)
  const fen = boardToFEN(S.board, S.turn);
  const url = location.origin + "/apps/chess/index.html#fen=" + encodeURIComponent(fen);
  try{
    await navigator.clipboard.writeText(url);
    alert("Copied link to clipboard.");
  }catch(e){
    // fallback
    prompt("Copy this link:", url);
  }
};

btnImport.onclick = () => {
  const raw = prompt("Paste FEN to import (v1 simple):");
  if(raw === null) return;
  try{
    const parsed = fenToBoard(raw);
    // hard reset game state to imported position (forward-only)
    S.board = parsed.board;
    S.turn = parsed.turn;
    S.selected = null;
    S.lastMove = null;
    S.history = [];
    S.pgn = [];
    saveState(S);
    render();
  }catch(e){
    alert("Import failed: " + (e && e.message ? e.message : String(e)));
  }
};

// Auto-import from URL hash if present
(() => {
  const h = (location.hash || "").trim();
  if(!h.startsWith("#fen=")) return;
  try{
    const fen = decodeURIComponent(h.slice(5));
    const parsed = fenToBoard(fen);
    S.board = parsed.board;
    S.turn = parsed.turn;
    S.selected = null;
    S.lastMove = null;
    S.history = [];
    S.pgn = [];
    saveState(S);
    // clear hash to avoid repeated imports
    history.replaceState(null, "", location.pathname + location.search);
  }catch(e){
    // ignore
  }
})();

render();


// ==================================================
// DTN — Determinism Test Mode (B10)
// Purpose: Prove drift-free execution via replay
// Trigger: /apps/chess/?det_test=1
// ==================================================
(function(){
  // Lightweight stable hash (FNV-1a 32-bit)
  function hash32(str){
    let h = 0x811c9dc5;
    for(let i=0;i<str.length;i++){
      h ^= str.charCodeAt(i);
      h = (h + ((h<<1)+(h<<4)+(h<<7)+(h<<8)+(h<<24))) >>> 0;
    }
    return ("00000000" + h.toString(16)).slice(-8);
  }

  function safeStringify(obj){
    try { return JSON.stringify(obj); } catch(e){ return String(obj); }
  }

  function snapshotState(){
    // Try common state holders (adapt to your engine without breaking)
    // Order is important: most-likely first.
    const candidates = [
      (typeof gameState !== "undefined") ? gameState : null,
      (typeof state !== "undefined") ? state : null,
      (typeof GAME !== "undefined") ? GAME : null,
      (typeof window !== "undefined") ? (window.gameState || window.state || window.GAME) : null
    ].filter(Boolean);

    if(!candidates.length) return { ok:false, why:"No state object found" };

    const gs = candidates[0];

    // If board is present, hash that; else hash whole state (bounded)
    const board = gs.board || gs.BOARD || gs.position || null;

    let payload;
    if(board){
      payload = { board, turn: gs.turn || gs.side || gs.toMove || null, meta: {
        seed: gs.seed || null, invited: gs.invited || false
      }};
    } else {
      // Keep bounded: only stable fields
      payload = {
        seed: gs.seed || null,
        invited: gs.invited || false,
        turn: gs.turn || gs.side || gs.toMove || null,
        board_like: gs.board || gs.BOARD || gs.position || null
      };
    }

    return { ok:true, payload };
  }

  function stateHash(){
    const snap = snapshotState();
    if(!snap.ok) return { ok:false, hash:"", why:snap.why };
    return { ok:true, hash: hash32(safeStringify(snap.payload)), why:"" };
  }

  // Try to find a move API without assuming exact naming
  function findMoveAPI(){
    const fns = [];

    // common candidates
    if(typeof makeMove === "function") fns.append = None

    const cand = [
      (typeof window !== "undefined" ? window.makeMove : null),
      (typeof window !== "undefined" ? window.applyMove : null),
      (typeof window !== "undefined" ? window.move : null),
      (typeof window !== "undefined" ? window.doMove : null),
      (typeof window !== "undefined" ? window.engineMove : null),
      (typeof window !== "undefined" ? window.chessMove : null)
    ].filter(x => typeof x === "function");

    // also: methods on known objects
    const objs = [];
    if(typeof window !== "undefined"){
      if(window.game) objs.push(window.game);
      if(window.engine) objs.push(window.engine);
      if(window.chess) objs.push(window.chess);
    }
    if(typeof game !== "undefined") objs.push(game);
    if(typeof engine !== "undefined") objs.push(engine);
    if(typeof chess !== "undefined") objs.push(chess);

    for(const o of objs){
      if(!o) continue;
      for(const name of ["makeMove","applyMove","move","doMove","push","playMove"]){
        if(typeof o[name] === "function") cand.push(o[name].bind(o));
      }
    }

    if(!cand.length) return null;
    return cand[0];
  }

  function findResetAPI(){
    const cand = [
      (typeof window !== "undefined" ? window.resetGame : null),
      (typeof window !== "undefined" ? window.newGame : null),
      (typeof window !== "undefined" ? window.initGame : null)
    ].filter(x => typeof x === "function");

    const objs = [];
    if(typeof window !== "undefined"){
      if(window.game) objs.push(window.game);
      if(window.engine) objs.push(window.engine);
      if(window.chess) objs.push(window.chess);
    }
    if(typeof game !== "undefined") objs.push(game);
    if(typeof engine !== "undefined") objs.push(engine);
    if(typeof chess !== "undefined") objs.push(chess);

    for(const o of objs){
      if(!o) continue;
      for(const name of ["reset","newGame","init","start","setup"]){
        if(typeof o[name] === "function") cand.push(o[name].bind(o));
      }
    }

    if(!cand.length) return null;
    return cand[0];
  }

  function el(tag, css, txt){
    const d = document.createElement(tag);
    if(css) d.style.cssText = css;
    if(txt !== undefined) d.textContent = txt;
    return d;
  }

  function mountPanel(){
    const root = document.querySelector("#app") || document.body;

    const panel = el("div",
      "border:1px solid rgba(122,60,255,.45);background:rgba(122,60,255,.10);border-radius:12px;padding:12px;margin:10px 0;font-size:13px;letter-spacing:.06em;"
    );
    panel.id = "dtn_det_panel";

    const top = el("div","display:flex;gap:10px;align-items:center;flex-wrap:wrap;justify-content:space-between;margin-bottom:8px;");
    const title = el("b","color:#d9c9ff;","DETERMINISM TEST");
    const badge = el("span","padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.12);color:#b0b0d0;background:rgba(0,0,0,.15);","READY");

    top.appendChild(title);
    top.appendChild(badge);

    const row = el("div","display:flex;gap:8px;flex-wrap:wrap;align-items:center;");
    const btn = el("button",
      "border:1px solid rgba(122,60,255,.45);background:rgba(122,60,255,.18);color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;letter-spacing:.08em;cursor:pointer;",
      "RUN TEST"
    );
    const btn2 = el("button",
      "border:1px solid rgba(255,255,255,.18);background:transparent;color:#fff;border-radius:10px;padding:8px 12px;font-weight:800;letter-spacing:.08em;cursor:pointer;",
      "COPY PROOF"
    );

    const out = el("div","margin-top:10px;color:#b0b0d0;white-space:pre-wrap;word-break:break-word;","");

    row.appendChild(btn);
    row.appendChild(btn2);

    panel.appendChild(top);
    panel.appendChild(row);
    panel.appendChild(out);

    root.prepend(panel);

    return { panel, badge, out, btn, btn2 };
  }

  function formatProof(lines){
    return lines.join("\n");
  }

  function runSuite(ui){
    const moveFn = findMoveAPI();
    const resetFn = findResetAPI();

    const proof = [];
    proof.push("AMETHYST • D.R.E. Determinism Proof");
    proof.push("MODE: CHESS • TEST: REPLAY CONSISTENCY");
    proof.push("TIME: " + new Date().toISOString());

    if(!moveFn){
      ui.badge.textContent = "FAIL";
      ui.out.textContent = "Engine hook not found (no move API). B10 installed but cannot execute suite yet.";
      proof.push("RESULT: FAIL — no move API");
      ui._lastProof = formatProof(proof);
      return;
    }

    // If reset exists, use it; otherwise continue from current state (still deterministic, but less clean)
    if(resetFn){
      try { resetFn(); } catch(e){}
    }

    const pre = stateHash();
    if(!pre.ok){
      ui.badge.textContent = "FAIL";
      ui.out.textContent = "No hashable state: " + pre.why;
      proof.push("RESULT: FAIL — " + pre.why);
      ui._lastProof = formatProof(proof);
      return;
    }

    // Minimal canonical opening sequence (coordinate formats vary; we attempt multiple shapes)
    // We run it TWICE from the same initial state and require identical hashes.
    const seq = [
      // Try common notations in order: UCI, "e2e4", {from,to}
      ["e2","e4"],
      ["e7","e5"],
      ["g1","f3"],
      ["b8","c6"],
      ["f1","c4"],
      ["g8","f6"]
    ];

    function doMove(from,to){
      // Try function signatures
      try {
        // (from,to)
        const r = moveFn(from,to);
        if(r !== false) return true;
      } catch(e){}

      try {
        // "e2e4"
        const r = moveFn(from+to);
        if(r !== false) return true;
      } catch(e){}

      try {
        // {from,to}
        const r = moveFn({from, to});
        if(r !== false) return true;
      } catch(e){}

      return false;
    }

    function applySequence(){
      for(const [f,t] of seq){
        const ok = doMove(f,t);
        if(!ok) return { ok:false, why:`Move rejected: ${f}->${t}` };
      }
      const h = stateHash();
      if(!h.ok) return { ok:false, why:h.why };
      return { ok:true, hash:h.hash };
    }

    // Run #1
    const r1 = applySequence();
    if(!r1.ok){
      ui.badge.textContent = "FAIL";
      ui.out.textContent = r1.why;
      proof.push("START_HASH: " + pre.hash);
      proof.push("RESULT: FAIL — " + r1.why);
      ui._lastProof = formatProof(proof);
      return;
    }

    // Reset and run #2
    if(resetFn){
      try { resetFn(); } catch(e){}
    }

    const pre2 = stateHash();
    if(!pre2.ok){
      ui.badge.textContent = "FAIL";
      ui.out.textContent = "Reset succeeded but state not hashable: " + pre2.why;
      proof.push("RESULT: FAIL — reset state unhashable");
      ui._lastProof = formatProof(proof);
      return;
    }

    const r2 = applySequence();
    if(!r2.ok){
      ui.badge.textContent = "FAIL";
      ui.out.textContent = r2.why;
      proof.push("RESULT: FAIL — " + r2.why);
      ui._lastProof = formatProof(proof);
      return;
    }

    // Determinism check
    const pass = (pre.hash == pre2.hash) and (r1.hash == r2.hash);
    if(pass){
      ui.badge.textContent = "PASS";
      ui.out.textContent =
        "PASS\n" +
        "Start: " + pre.hash + "\n" +
        "Replay: " + r1.hash + "\n" +
        "Replay2: " + r2.hash + "\n" +
        "Determinism holds (identical hashes).";
      proof.push("START_HASH: " + pre.hash);
      proof.push("REPLAY_HASH: " + r1.hash);
      proof.push("REPLAY2_HASH: " + r2.hash);
      proof.push("RESULT: PASS — identical hashes");
    } else {
      ui.badge.textContent = "FAIL";
      ui.out.textContent =
        "FAIL\n" +
        "Start: " + pre.hash + "\n" +
        "Start2: " + pre2.hash + "\n" +
        "Replay: " + r1.hash + "\n" +
        "Replay2: " + r2.hash + "\n" +
        "Non-determinism detected (hash mismatch).";
      proof.push("START_HASH: " + pre.hash);
      proof.push("START2_HASH: " + pre2.hash);
      proof.push("REPLAY_HASH: " + r1.hash);
      proof.push("REPLAY2_HASH: " + r2.hash);
      proof.push("RESULT: FAIL — mismatch detected");
    }

    ui._lastProof = formatProof(proof);
  }

  function enableDeterminismTest(){
    const params = new URLSearchParams(window.location.search);
    const on = params.get("det_test") === "1";
    if(!on) return;

    const ui = mountPanel();

    ui.btn.addEventListener("click", () => runSuite(ui));
    ui.btn2.addEventListener("click", async () => {
      const txt = ui._lastProof || "No proof yet. Click RUN TEST.";
      try{
        await navigator.clipboard.writeText(txt);
        ui.out.textContent = (ui.out.textContent || "") + "\n\n(Copied Determinism Proof)";
      }catch(e){
        // fallback
        const ta = document.createElement("textarea");
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.remove();
        ui.out.textContent = (ui.out.textContent || "") + "\n\n(Copied Determinism Proof)";
      }
    });

    // Auto-run once
    setTimeout(() => runSuite(ui), 250);
  }

  // Attach after page load / init
  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", enableDeterminismTest);
  } else {
    enableDeterminismTest();
  }
})();

