// Forward-only match persistence

const KEY = "amethyst_chess_matches_v1";

export function loadMatches(){
  const raw = localStorage.getItem(KEY);
  if(raw){
    try { return JSON.parse(raw); } catch(e){}
  }
  return {};
}

export function saveMatches(m){
  localStorage.setItem(KEY, JSON.stringify(m));
}

export function persistMatch(match){
  const m = loadMatches();
  m[match.id] = match;
  saveMatches(m);
}
