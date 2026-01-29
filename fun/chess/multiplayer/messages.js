// Deterministic Network Message Schema (v1)

export function moveMessage(matchId, move){
  return {
    type: "CHESS_MOVE",
    match_id: matchId,
    payload: {
      from: move.from,
      to: move.to,
      piece: move.piece,
      color: move.color,
      fen_after: move.fen_after
    },
    ts: new Date().toISOString()
  };
}

export function joinMessage(matchId, playerId){
  return {
    type: "CHESS_JOIN",
    match_id: matchId,
    player_id: playerId,
    ts: new Date().toISOString()
  };
}

export function resignMessage(matchId, color){
  return {
    type: "CHESS_RESIGN",
    match_id: matchId,
    color,
    ts: new Date().toISOString()
  };
}
