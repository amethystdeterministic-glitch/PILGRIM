const GLYPHS = {
  "WK":"♔","WQ":"♕","WR":"♖","WB":"♗","WN":"♘","WP":"♙",
  "BK":"♚","BQ":"♛","BR":"♜","BB":"♝","BN":"♞","BP":"♟"
};

// Simple, bold, deterministic SVG silhouettes (no external assets)
function svgWrap(pathD, tone){
  return `
  <svg viewBox="0 0 64 64" width="28" height="28" aria-hidden="true">
    <path d="${pathD}" fill="${tone}" />
  </svg>`;
}

// AMETHYST SET: alien-tech silhouettes per piece class (shared per side with tone)
const PATHS = {
  K: "M32 8c6 0 10 4 10 10 0 4-2 7-5 9l5 16H22l5-16c-3-2-5-5-5-9 0-6 4-10 10-10zm-8 44h16l2 4H22l2-4z",
  Q: "M20 18l4-8 8 6 8-6 4 8-6 6 4 18H22l4-18-6-6zm6 34h12l2 4H24l2-4z",
  R: "M22 14h20v10c0 4-3 7-7 7h-6l3 10H24l3-10h-5V14zm4 34h12l2 4H24l2-4z",
  B: "M32 10c5 0 9 4 9 9 0 4-2 7-5 9l4 14H24l4-14c-3-2-5-5-5-9 0-5 4-9 9-9zm-10 42h20l2 4H20l2-4z",
  N: "M22 40c6-18 14-26 20-26 4 0 6 2 6 6 0 7-8 11-16 13l4 7H24l-2-0zm4 12h12l2 4H24l2-4z",
  P: "M32 12c6 0 10 4 10 10s-4 10-10 10-10-4-10-10 4-10 10-10zm-10 30h20l2 10H20l2-10z"
};

export function getSkin(){
  return localStorage.getItem("amethyst_chess_skin_v1") || "AMETHYST"; // AMETHYST | CLASSIC
}

export function setSkin(v){
  localStorage.setItem("amethyst_chess_skin_v1", v);
}

export function renderPiece(piece){
  if(!piece) return "";
  const skin = getSkin();
  if(skin === "CLASSIC"){
    return `<span class="pieceGlyph">${GLYPHS[piece] || ""}</span>`;
  }

  const side = piece[0];        // W/B
  const kind = piece[1];        // KQ RBNP
  const tone = (side === "W") ? "#f5f2ff" : "#191727";
  const glow = (side === "W") ? "drop-shadow(0 0 10px rgba(122,60,255,.25))" : "drop-shadow(0 0 10px rgba(0,0,0,.35))";

  const svg = svgWrap(PATHS[kind] || PATHS.P, tone);
  return `<span class="pieceSvg" style="filter:${glow}">${svg}</span>`;
}
