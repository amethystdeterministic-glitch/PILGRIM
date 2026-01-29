#!/usr/bin/env bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
TARGET_DIR="$ROOT/sources/deterministic-law"
TARGET_FILE="$TARGET_DIR/index.html"

mkdir -p "$TARGET_DIR"

# Placeholder so the route exists immediately
cat << 'HTML' > "$TARGET_FILE"
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Deterministic Law</title>
  <style>
    body{margin:0;padding:24px;background:#0b0b0e;color:#ddd;font-family:system-ui}
    h1{letter-spacing:.12em}
    p{opacity:.75;max-width:60ch}
    code{opacity:.9}
  </style>
</head>
<body>
  <h1>DETERMINISTIC LAW</h1>
  <p>Placeholder. Replace this file with the final deterministic-law page HTML.</p>
  <p>Path: <code>~/amethyst/runtime_v2/sources/deterministic-law/index.html</code></p>
</body>
</html>
HTML

echo "GREEN: Created $TARGET_FILE"
echo "Edit with:"
echo "  nano $TARGET_FILE"
echo "View at:"
echo "  http://127.0.0.1:9192/sources/deterministic-law/"
