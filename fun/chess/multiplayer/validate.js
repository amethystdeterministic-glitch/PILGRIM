// Deterministic Move Validation Contract

export function validateMove(match, move){
  if(!match || !move){
    return { ok:false, reason:"Missing match or move" };
  }

  if(match.status !== "ACTIVE"){
    return { ok:false, reason:"Match not active" };
  }

  if(move.color !== match.turn){
    return { ok:false, reason:"Out of turn" };
  }

  if(!move.from || !move.to){
    return { ok:false, reason:"Invalid coordinates" };
  }

  if(move.from === move.to){
    return { ok:false, reason:"Null move" };
  }

  if(!move.fen_after){
    return { ok:false, reason:"Missing resulting FEN" };
  }

  return { ok:true };
}
