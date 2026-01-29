#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
NAV="$ROOT/sources/amethyst/blocks/nav.html"
CSS="$ROOT/sources/amethyst/blocks/nav.css"

mkdir -p "$(dirname "$NAV")"

cat << 'HTML' > "$NAV"
<nav class="amethyst-nav">
  <a href="/sources/amethyst/">Amethyst</a>
  <span>·</span>
  <a href="/sources/amethyst/deterministic-law/">Deterministic Law</a>
  <span>·</span>
  <a href="/sources/amethyst/what-is-a-source/">What Is a Source</a>
  <span>·</span>
  <a href="/sources/amethyst/amethyst-deterministic-ltd/">Company</a>
  <span>·</span>
  <a href="/sources/amethyst/tiers/">Tiers</a>
</nav>
HTML

cat << 'CSS' > "$CSS"
.amethyst-nav {
  margin: 1.5rem 0 2.5rem 0;
  font-size: 0.95rem;
}
.amethyst-nav a {
  color: #7c3aed;
  text-decoration: underline;
  font-weight: 500;
}
.amethyst-nav span {
  margin: 0 0.5rem;
  opacity: 0.4;
}
CSS

echo "[B5.3] ✔ Amethyst nav block created"
