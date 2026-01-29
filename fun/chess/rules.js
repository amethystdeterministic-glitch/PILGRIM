// Amethyst Chess — Rules Engine (v1)
// Deterministic. Pure functions. No DOM. No time. No randomness.

export const PIECES = {
  WP:"WP", WN:"WN", WB:"WB", WR:"WR", WQ:"WQ", WK:"WK",
  BP:"BP", BN:"BN", BB:"BB", BR:"BR", BQ:"BQ", BK:"BK"
};

export const COLORS = { W:"W", B:"B" };

export function colorOf(piece){
  if(!piece) return null;
  return piece[0] === "W" ? "W" : "B";
}
export function typeOf(piece){
  if(!piece) return null;
  return piece[1]; // P N B R Q K
}

export function inBounds(r,c){ return r>=0 && r<8 && c>=0 && c<8; }

export function cloneBoard(board){
  return board.map(row => row.slice());
}

export function at(board, r, c){
  if(!inBounds(r,c)) return null;
  return board[r][c];
}

export function setAt(board, r, c, v){
  board[r][c] = v;
  return board;
}

export function coordToAlg(r,c){
  // r=0 is rank 8, c=0 is file a
  const file = String.fromCharCode("a".charCodeAt(0) + c);
  const rank = String(8 - r);
  return file + rank;
}

export function algToCoord(alg){
  const a = (alg||"").trim().toLowerCase();
  if(a.length !== 2) return null;
  const file = a.charCodeAt(0) - "a".charCodeAt(0);
  const rank = parseInt(a[1],10);
  if(file<0||file>7||rank<1||rank>8) return null;
  return { r: 8-rank, c: file };
}

export function opponent(color){ return color === "W" ? "B" : "W"; }

// ==========================
// Move generation (pseudo-legal)
// ==========================
function pushIf(board, moves, from, to, color){
  const p = at(board, to.r, to.c);
  if(!p){
    moves.push({from, to, capture:false});
    return true; // can continue sliding
  }
  if(colorOf(p) !== color){
    moves.push({from, to, capture:true});
  }
  return false; // blocked
}

function genPawn(board, r,c, color){
  const moves=[];
  const dir = (color === "W") ? -1 : 1;
  const startRow = (color === "W") ? 6 : 1;

  const one = {r:r+dir, c};
  if(inBounds(one.r, one.c) && !at(board, one.r, one.c)){
    moves.push({from:{r,c}, to:one, capture:false, promo: (one.r===0||one.r===7)});
    const two = {r:r+2*dir, c};
    if(r===startRow && !at(board, two.r, two.c)){
      moves.push({from:{r,c}, to:two, capture:false});
    }
  }

  for(const dc of [-1,1]){
    const cap = {r:r+dir, c:c+dc};
    if(!inBounds(cap.r, cap.c)) continue;
    const target = at(board, cap.r, cap.c);
    if(target && colorOf(target) !== color){
      moves.push({from:{r,c}, to:cap, capture:true, promo:(cap.r===0||cap.r===7)});
    }
  }
  return moves;
}

function genKnight(board, r,c, color){
  const moves=[];
  const deltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  for(const [dr,dc] of deltas){
    const nr=r+dr,nc=c+dc;
    if(!inBounds(nr,nc)) continue;
    const t = at(board,nr,nc);
    if(!t || colorOf(t)!==color){
      moves.push({from:{r,c}, to:{r:nr,c:nc}, capture:!!t});
    }
  }
  return moves;
}

function genKing(board, r,c, color){
  const moves=[];
  for(let dr=-1; dr<=1; dr++){
    for(let dc=-1; dc<=1; dc++){
      if(dr===0 && dc===0) continue;
      const nr=r+dr,nc=c+dc;
      if(!inBounds(nr,nc)) continue;
      const t = at(board,nr,nc);
      if(!t || colorOf(t)!==color){
        moves.push({from:{r,c}, to:{r:nr,c:nc}, capture:!!t});
      }
    }
  }
  // Castling handled in a later batch (kept deterministic)
  return moves;
}

function genSlides(board, r,c, color, dirs){
  const moves=[];
  for(const [dr,dc] of dirs){
    let nr=r+dr, nc=c+dc;
    while(inBounds(nr,nc)){
      const ok = pushIf(board, moves, {r,c}, {r:nr,c:nc}, color);
      if(!ok) break;
      nr += dr; nc += dc;
    }
  }
  return moves;
}

function genBishop(board,r,c,color){
  return genSlides(board,r,c,color, [[-1,-1],[-1,1],[1,-1],[1,1]]);
}
function genRook(board,r,c,color){
  return genSlides(board,r,c,color, [[-1,0],[1,0],[0,-1],[0,1]]);
}
function genQueen(board,r,c,color){
  return genSlides(board,r,c,color, [[-1,-1],[-1,1],[1,-1],[1,1],[-1,0],[1,0],[0,-1],[0,1]]);
}

export function pseudoMovesFor(board, r,c){
  const piece = at(board,r,c);
  if(!piece) return [];
  const color = colorOf(piece);
  const t = typeOf(piece);
  if(t==="P") return genPawn(board,r,c,color);
  if(t==="N") return genKnight(board,r,c,color);
  if(t==="B") return genBishop(board,r,c,color);
  if(t==="R") return genRook(board,r,c,color);
  if(t==="Q") return genQueen(board,r,c,color);
  if(t==="K") return genKing(board,r,c,color);
  return [];
}

export function findKing(board, color){
  const target = color==="W" ? "WK" : "BK";
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      if(board[r][c]===target) return {r,c};
    }
  }
  return null;
}

export function isSquareAttacked(board, sq, byColor){
  // brute-force deterministic scan
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const p = at(board,r,c);
      if(!p) continue;
      if(colorOf(p)!==byColor) continue;
      const t = typeOf(p);

      // Special-case pawns for attack pattern (not movement)
      if(t==="P"){
        const dir = (byColor==="W") ? -1 : 1;
        for(const dc of [-1,1]){
          const ar=r+dir, ac=c+dc;
          if(ar===sq.r && ac===sq.c) return true;
        }
        continue;
      }

      const ms = pseudoMovesFor(board,r,c);
      for(const m of ms){
        if(m.to.r===sq.r && m.to.c===sq.c) return true;
      }
    }
  }
  return false;
}

export function applyMove(board, move){
  // returns NEW board (pure)
  const b = cloneBoard(board);
  const piece = at(b, move.from.r, move.from.c);
  setAt(b, move.from.r, move.from.c, null);

  // promotion: deterministic default to Queen unless specified
  if(move.promo){
    const col = colorOf(piece);
    const promoteTo = move.promoteTo || (col==="W" ? "WQ" : "BQ");
    setAt(b, move.to.r, move.to.c, promoteTo);
  } else {
    setAt(b, move.to.r, move.to.c, piece);
  }
  return b;
}

export function legalMovesFor(board, r,c, turnColor){
  const piece = at(board,r,c);
  if(!piece) return [];
  if(colorOf(piece)!==turnColor) return [];
  const pseudo = pseudoMovesFor(board,r,c);
  const out=[];
  for(const m of pseudo){
    const b2 = applyMove(board, m);
    const k = findKing(b2, turnColor);
    if(!k) continue;
    const inCheck = isSquareAttacked(b2, k, opponent(turnColor));
    if(!inCheck) out.push(m);
  }
  return out;
}

export function hasAnyLegalMove(board, turnColor){
  for(let r=0;r<8;r++){
    for(let c=0;c<8;c++){
      const p = at(board,r,c);
      if(!p) continue;
      if(colorOf(p)!==turnColor) continue;
      if(legalMovesFor(board,r,c,turnColor).length) return true;
    }
  }
  return false;
}

export function gameStatus(board, turnColor){
  const k = findKing(board, turnColor);
  if(!k) return { status:"INVALID", reason:"KING_MISSING" };
  const inCheck = isSquareAttacked(board, k, opponent(turnColor));
  const any = hasAnyLegalMove(board, turnColor);
  if(any) return { status: inCheck ? "CHECK" : "OK" };
  return { status: inCheck ? "CHECKMATE" : "STALEMATE" };
}
