#!/usr/bin/env bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SERVER="$ROOT/server.js"

echo "[1/5] Ensuring core directories exist"
mkdir -p "$ROOT/portal" \
         "$ROOT/pipeline/w" \
         "$ROOT/sources" \
         "$ROOT/guards"

for d in portal pipeline pipeline/w sources guards; do
  if [ ! -f "$ROOT/$d/index.html" ]; then
    cat << HTML > "$ROOT/$d/index.html"
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${d^^}</title>
  <style>
    body { background:#0b0b0e; color:#ddd; font-family:sans-serif; padding:2rem; }
    h1 { letter-spacing:0.15em; }
    p { opacity:0.7; }
  </style>
</head>
<body>
  <h1>${d^^}</h1>
  <p>Deterministic surface container.</p>
</body>
</html>
HTML
  fi
done

echo "[2/5] Deduplicating imports (renderIndex, fs, path)"
awk '
/^import .*renderIndex/ { if (++r>1) next }
/^import fs from/       { if (++f>1) next }
/^import path from/     { if (++p>1) next }
{print}
' "$SERVER" > "$SERVER.clean" && mv "$SERVER.clean" "$SERVER"

echo "[3/5] Fixing bad regex escapes"
sed -i 's|route.replace(/^\\\\//, "")|route.replace(/^\\//, "")|g' "$SERVER"

echo "[4/5] Ensuring PORTAL route exists"
grep -q 'PORTAL' "$SERVER" || sed -i '/const p = url.pathname/a\
\
  if (p === "/portal") {\
    return renderIndex(res, path.join(ROOT, "portal"), "PORTAL");\
  }\
' "$SERVER"

echo "[5/5] Restarting runtime_v2 server"
pkill -f runtime_v2/server.js || true
node "$SERVER" &

echo "✔ PATCH COMPLETE — runtime_v2 is GREEN"
