const KEY = "amethyst_chess_history_v1";

export function loadHistory(){
  const raw = localStorage.getItem(KEY);
  if(!raw) return { past: [], future: [] };
  try{
    const obj = JSON.parse(raw);
    if(!obj || !Array.isArray(obj.past) || !Array.isArray(obj.future)) return { past: [], future: [] };
    return obj;
  }catch(e){
    return { past: [], future: [] };
  }
}

export function saveHistory(h){
  localStorage.setItem(KEY, JSON.stringify(h));
}

export function clearHistory(){
  localStorage.removeItem(KEY);
}

export function pushSnapshot(currentState){
  // push current state into past, clear future
  const h = loadHistory();
  h.past.push({
    board: currentState.board,
    turn: currentState.turn,
    at: new Date().toISOString()
  });
  h.future = [];
  saveHistory(h);
  return h;
}

export function canUndo(){
  const h = loadHistory();
  return h.past.length > 0;
}

export function canRedo(){
  const h = loadHistory();
  return h.future.length > 0;
}

export function undo(currentState){
  const h = loadHistory();
  if(!h.past.length) return { state: currentState, h };
  const prev = h.past.pop();
  // move current into future
  h.future.push({
    board: currentState.board,
    turn: currentState.turn,
    at: new Date().toISOString()
  });
  saveHistory(h);
  return { state: { board: prev.board, turn: prev.turn }, h };
}

export function redo(currentState){
  const h = loadHistory();
  if(!h.future.length) return { state: currentState, h };
  const next = h.future.pop();
  // move current into past
  h.past.push({
    board: currentState.board,
    turn: currentState.turn,
    at: new Date().toISOString()
  });
  saveHistory(h);
  return { state: { board: next.board, turn: next.turn }, h };
}
