import { loadState, saveState } from "./state.js";
import { loadHistory, saveHistory, clearHistory } from "./history.js";

export function exportGame(){
  const state = loadState();
  const hist = loadHistory();
  const payload = {
    schema: "amethyst.chess.game.v1",
    exported_at: new Date().toISOString(),
    state,
    history: hist
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "amethyst_chess_game_v1.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importGameFromFile(file){
  const txt = await file.text();
  let payload;
  try { payload = JSON.parse(txt); } catch(e){ throw new Error("Invalid JSON"); }

  if(!payload || payload.schema !== "amethyst.chess.game.v1"){
    throw new Error("Wrong schema");
  }

  if(!payload.state || !payload.state.board || !payload.state.turn){
    throw new Error("Missing state");
  }

  // Apply deterministically:
  saveState(payload.state);

  if(payload.history && Array.isArray(payload.history.past) && Array.isArray(payload.history.future)){
    saveHistory(payload.history);
  }else{
    clearHistory();
  }

  // Reload to rebind UI cleanly
  location.reload();
}
