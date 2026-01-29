/*
  Amethyst Chess — Deterministic Match Layer (B11)
  No realtime networking yet.
  Prepares identity-safe matches for future Mundo bridge.
*/

export function deterministicMatchId(playerA, playerB){
  const canon = [playerA, playerB].sort().join("|");
  let h = 2166136261;
  for (let i = 0; i < canon.length; i++) {
    h ^= canon.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return "match_" + (h >>> 0).toString(16);
}

export function createMatch({white, black}){
  return {
    id: deterministicMatchId(white, black),
    white,
    black,
    created_at: new Date().toISOString(),
    state: "ACTIVE",
    moves: []
  };
}

export function applyMove(match, move){
  match.moves.push({
    ply: match.moves.length + 1,
    move,
    at: new Date().toISOString()
  });
  return match;
}
