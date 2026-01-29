#!/bin/bash
set -e

ROOT="$HOME/amethyst/runtime_v2"
SOURCES="$ROOT/sources"
REGISTRY="$SOURCES/_registry.json"

# ===============================
# BATCH 17 — AUTO REBUILD (FS WATCH FALLBACK)
# ===============================
# Lightweight rebuild hook (manual trigger friendly)
cat << 'SH' > "$ROOT/rebuild.sh"
#!/bin/bash
set -e
"$HOME/amethyst/runtime_v2/_build_sources_registry.sh"
echo "REBUILD COMPLETE"
SH
chmod +x "$ROOT/rebuild.sh"

# ===============================
# BATCH 18 — PAGE METADATA + ORDERING
# ===============================
# Ensure page meta schema exists per page
for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  for PAGE in "$SRC"/*; do
    [ -d "$PAGE" ] || continue
    NAME=$(basename "$PAGE")
    META="$PAGE/page.json"
    if [ ! -f "$META" ]; then
      cat << JSON > "$META"
{
  "title": "$NAME",
  "order": 999,
  "visibility": "public"
}
JSON
    fi
  done
done

# ===============================
# BATCH 19 — VERSIONED PAGES
# ===============================
# Create v1 container for each source if missing
for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  if [ ! -d "$SRC/v1" ]; then
    mkdir -p "$SRC/v1"
    cp -r "$SRC"/* "$SRC/v1/" 2>/dev/null || true
  fi
done

# ===============================
# BATCH 20 — MEDIA LAYOUT PER PAGE
# ===============================
# Standardize media directories
for SRC in "$SOURCES"/*; do
  [ -d "$SRC" ] || continue
  [ -f "$SRC/source.json" ] || continue

  mkdir -p "$SRC/media/images" "$SRC/media/video"

  for PAGE in "$SRC"/*; do
    [ -d "$PAGE" ] || continue
    mkdir -p "$PAGE/media/images" "$PAGE/media/video"
  done
done

echo "BATCH 17–20 COMPLETE"
