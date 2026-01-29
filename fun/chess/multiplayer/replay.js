// Replay + proof export

export function exportReplay(match){
  return {
    match_id: match.id,
    players: match.players,
    history: match.history,
    finished_at: match.finished_at,
    proof: "DETERMINISTIC_EXECUTION"
  };
}

export function downloadReplay(match){
  const data = JSON.stringify(exportReplay(match), null, 2);
  const blob = new Blob([data], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "chess_replay_"+match.id+".json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
