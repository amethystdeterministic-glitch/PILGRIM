// Deterministic matchmaking lobby

const LOBBY_KEY = "amethyst_chess_lobby_v1";

export function loadLobby(){
  const raw = localStorage.getItem(LOBBY_KEY);
  if(raw){
    try { return JSON.parse(raw); } catch(e){}
  }
  return [];
}

export function saveLobby(l){
  localStorage.setItem(LOBBY_KEY, JSON.stringify(l));
}

export function joinLobby(playerId){
  const l = loadLobby();
  if(!l.includes(playerId)){
    l.push(playerId);
    saveLobby(l);
  }
}

export function leaveLobby(playerId){
  const l = loadLobby().filter(p => p !== playerId);
  saveLobby(l);
}

export function pairPlayers(){
  const l = loadLobby();
  if(l.length < 2) return null;
  const [a,b] = l.slice(0,2);
  saveLobby(l.slice(2));
  return { white:a, black:b };
}
