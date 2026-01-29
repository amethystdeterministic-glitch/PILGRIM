import { validateMove } from "./validate.js";
import { applyMove, resign } from "./match.js";

export function handleMove(match, move){
  const v = validateMove(match, move);
  if(!v.ok){
    return { ok:false, reason:v.reason, match };
  }

  const updated = applyMove(match, move);
  return { ok:true, match: updated };
}

export function handleResign(match, color){
  const updated = resign(match, color);
  return { ok:true, match: updated };
}
