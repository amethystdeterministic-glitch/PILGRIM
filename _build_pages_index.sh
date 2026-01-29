#!/bin/bash
set -e

SOURCE="$1"

if [ -z "$SOURCE" ]; then
  echo "Usage: ./_build_pages_index.sh <source>"
  exit 1
fi

ROOT="$HOME/amethyst/runtime_v2/sources/$SOURCE"

if [ ! -d "$ROOT" ]; then
  echo "Source not found"
  exit 1
fi

OUT="$ROOT/pages/index.html"

cat << HTML > "$OUT"
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Pages</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<h1>Pages</h1>
<p>Each page lives inside this Source. Unlimited pages.</p>

<button onclick="createPage()">Create Page</button>

<ul>
HTML

for DIR in "$ROOT"/*; do
  NAME=$(basename "$DIR")
  if [ -d "$DIR" ] && [ -f "$DIR/index.html" ]; then
    case "$NAME" in
      blocks|media|builder|pages) continue ;;
    esac
    echo "  <li><a href=\"../$NAME/\">$NAME</a></li>" >> "$OUT"
  fi
done

cat << HTML >> "$OUT"
</ul>

<p><a href="../">← Back to Source</a></p>

<script>
async function createPage() {
  const page = prompt("Page name (letters, numbers, dashes):");
  if (!page) return;

  const res = await fetch("/api/page/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: "$SOURCE",
      page
    })
  });

  if (res.ok) {
    location.href = "../" + page + "/";
  } else {
    alert("Failed to create page");
  }
}
</script>

</body>
</html>
HTML

echo "PAGES INDEX BUILT FOR '$SOURCE'"
