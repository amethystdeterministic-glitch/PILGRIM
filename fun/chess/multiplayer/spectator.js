// Read-only spectator access

export function canSpectate(match, playerId){
  return match && !match.finished;
}

export function getPublicState(match){
  return {
    id: match.id,
    board: match.board,
    turn: match.turn,
    move_count: match.history.length
  };
}
