#!/bin/bash
set -e

PAGE="$HOME/amethyst/runtime_v2/sources/amethyst/what-is-a-source/index.html"

# Ensure nav CSS
grep -q nav.css "$PAGE" || \
  sed -i 's|</head>|<link rel="stylesheet" href="/sources/amethyst/blocks/nav.css"></head>|' "$PAGE"

# Inject nav after <body>
NAV=$(sed 's/[\/&]/\\&/g' "$HOME/amethyst/runtime_v2/sources/amethyst/blocks/nav.html")
sed -i "s|<body>|<body>\n$NAV|" "$PAGE"

echo "[B5.4] ✔ Page normalised as Amethyst internal page"
