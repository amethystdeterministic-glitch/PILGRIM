// Deterministic ladder (win-loss delta)

const KEY = "amethyst_chess_ranks_v1";

export function loadRanks(){
  const r = localStorage.getItem(KEY);
  if(r){
    try { return JSON.parse(r); } catch(e){}
  }
  return {};
}

export function saveRanks(r){
  localStorage.setItem(KEY, JSON.stringify(r));
}

export function recordResult(white, black, result){
  const r = loadRanks();
  r[white] = r[white] || 0;
  r[black] = r[black] || 0;

  if(result === "WHITE"){
    r[white] += 1;
    r[black] -= 1;
  } else if(result === "BLACK"){
    r[black] += 1;
    r[white] -= 1;
  }
  saveRanks(r);
}
