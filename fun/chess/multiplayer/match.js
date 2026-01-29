// Deterministic Chess Match Model (v1)

export function createMatch(matchId, whiteId, blackId){
  return {
    match_id: matchId,
    players: {
      white: whiteId,
      black: blackId
    },
    turn: "white",
    status: "ACTIVE", // ACTIVE | CHECKMATE | DRAW | RESIGNED
    fen: "startpos",
    move_history: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

export function applyMove(match, move){
  if(match.status !== "ACTIVE"){
    throw new Error("Match is not active");
  }

  if(move.color !== match.turn){
    throw new Error("Not your turn");
  }

  // NOTE:
  // Actual chess legality is enforced elsewhere
  // This layer is deterministic state transition only

  match.move_history.push({
    from: move.from,
    to: move.to,
    piece: move.piece,
    color: move.color,
    fen_before: match.fen,
    fen_after: move.fen_after,
    ts: new Date().toISOString()
  });

  match.fen = move.fen_after;
  match.turn = match.turn === "white" ? "black" : "white";
  match.updated_at = new Date().toISOString();

  return match;
}

export function resign(match, color){
  if(match.status !== "ACTIVE") return match;
  match.status = "RESIGNED";
  match.winner = color === "white" ? "black" : "white";
  match.updated_at = new Date().toISOString();
  return match;
}
