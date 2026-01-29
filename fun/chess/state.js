/*
  Amethyst Chess — Deterministic State Core
  No legality rules yet. No randomness.
*/

const START_FEN =
  "rnbqkbnr/" +
  "pppppppp/" +
  "8/8/8/8/" +
  "PPPPPPPP/" +
  "RNBQKBNR";

export const STATE_KEY = "amethyst_chess_state_v1";

export function loadState(){
  const raw = localStorage.getItem(STATE_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch(e){}
  }
  return {
    fen: START_FEN,
    turn: "white",
    move: 0,
    history: []
  };
}

export function saveState(state){
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function recordMove(state, from, to, piece){
  const next = structuredClone(state);
  next.move += 1;
  next.turn = next.turn === "white" ? "black" : "white";
  next.history.push({
    n: next.move,
    from,
    to,
    piece,
    turn: state.turn,
    ts: new Date().toISOString()
  });
  saveState(next);
  return next;
}

export function resetState(){
  localStorage.removeItem(STATE_KEY);
}
