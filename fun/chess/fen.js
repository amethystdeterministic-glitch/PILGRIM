export function boardToFEN(board, turn){
  const map = { P:"p", N:"n", B:"b", R:"r", Q:"q", K:"k" };
  const rows = board.map(r=>{
    let out="", n=0;
    for(const sq of r){
      if(!sq){ n++; continue; }
      if(n){ out+=String(n); n=0; }
      const side = sq[0], kind = sq[1];
      let ch = map[kind] || "?";
      if(side==="W") ch = ch.toUpperCase();
      out += ch;
    }
    if(n) out+=String(n);
    return out;
  });
  // v1: no castling / en-passant / halfmove / fullmove (kept deterministic & simple)
  return `${rows.join("/")}` + ` ${turn==="W"?"w":"b"} - - 0 1`;
}

export function fenToBoard(fen){
  const parts = String(fen||"").trim().split(/\s+/);
  if(parts.length < 2) throw new Error("Bad FEN");
  const rows = parts[0].split("/");
  if(rows.length !== 8) throw new Error("Bad FEN rows");
  const turn = (parts[1] === "b") ? "B" : "W";

  const rev = { p:"P", n:"N", b:"B", r:"R", q:"Q", k:"K" };
  const board = [];
  for(const row of rows){
    const r = [];
    for(const ch of row){
      if(/[1-8]/.test(ch)){
        const k = Number(ch);
        for(let i=0;i<k;i++) r.push(null);
      }else{
        const isUpper = (ch === ch.toUpperCase());
        const kind = rev[ch.toLowerCase()];
        if(!kind) throw new Error("Bad piece char");
        const side = isUpper ? "W" : "B";
        r.push(side + kind);
      }
    }
    if(r.length !== 8) throw new Error("Bad row width");
    board.push(r);
  }
  return { board, turn };
}
