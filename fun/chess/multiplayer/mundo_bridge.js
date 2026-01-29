// Mundo invite bridge (no transport coupling)

export function createInvite(matchId, fromPersona){
  return {
    type: "CHESS_INVITE",
    match_id: matchId,
    from: fromPersona,
    created_at: new Date().toISOString()
  };
}

export function acceptInvite(invite){
  return {
    join_match: invite.match_id,
    accepted_at: new Date().toISOString()
  };
}
