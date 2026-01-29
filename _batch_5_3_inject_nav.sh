#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2/sources/amethyst"
NAV="$ROOT/blocks/nav.html"
CSS="$ROOT/blocks/nav.css"

echo "[B5.3] Injecting nav into Amethyst pages"

for PAGE in \
  "$ROOT/index.html" \
  "$ROOT/deterministic-law/index.html" \
  "$ROOT/what-is-a-source/index.html" \
  "$ROOT/amethyst-deterministic-ltd/index.html" \
  "$ROOT/tiers/index.html"
do
  [ -f "$PAGE" ] || continue

  # ensure css link exists
  grep -q nav.css "$PAGE" || \
    sed -i 's|</head>|<link rel="stylesheet" href="/sources/amethyst/blocks/nav.css"></head>|' "$PAGE"

  # inject nav after <body>
  sed -i "s|<body>|<body>\n$(sed 's/[\/&]/\\&/g' "$NAV")|" "$PAGE"
done

echo "[B5.3] ✔ Navigation injected"
