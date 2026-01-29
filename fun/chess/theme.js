const KEY = "amethyst_chess_theme_v1";

export function getTheme(){
  return localStorage.getItem(KEY) || "AMETHYST_DARK"; // AMETHYST_DARK | MONO | PAPER
}

export function setTheme(t){
  localStorage.setItem(KEY, t);
}

export function applyTheme(){
  const t = getTheme();
  const r = document.documentElement;

  if(t === "MONO"){
    r.style.setProperty("--bg", "#0b0b0f");
    r.style.setProperty("--card", "#111116");
    r.style.setProperty("--accent", "#d0d0d0");
    r.style.setProperty("--sqDark", "#2a2a31");
    r.style.setProperty("--sqLight", "#1a1a20");
    return;
  }

  if(t === "PAPER"){
    r.style.setProperty("--bg", "#f3f2f7");
    r.style.setProperty("--card", "#ffffff");
    r.style.setProperty("--accent", "#6a4cff");
    r.style.setProperty("--sqDark", "#c9c7d8");
    r.style.setProperty("--sqLight", "#eceaf6");
    return;
  }

  // AMETHYST_DARK default
  r.style.setProperty("--bg", "#0a0a0f");
  r.style.setProperty("--card", "#11111f");
  r.style.setProperty("--accent", "#7a3cff");
  r.style.setProperty("--sqDark", "rgba(255,255,255,.06)");
  r.style.setProperty("--sqLight", "rgba(255,255,255,.02)");
}
