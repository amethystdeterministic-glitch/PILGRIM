// Remote handshake (stub)

export function createInvite(matchId, fromPlayer){
  return {
    type:"CHESS_INVITE",
    match_id: matchId,
    from: fromPlayer,
    created_at: new Date().toISOString()
  };
}

export function acceptInvite(invite, toPlayer){
  return {
    type:"CHESS_ACCEPT",
    match_id: invite.match_id,
    white: invite.from,
    black: toPlayer,
    accepted_at: new Date().toISOString()
  };
}
