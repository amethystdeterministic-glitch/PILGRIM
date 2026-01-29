import fs from "fs";
import path from "path";

export function renderSources(res, ROOT) {
  const registryPath = path.join(ROOT, "sources", "_registry.json");

  let sources = [];
  try {
    const data = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    sources = data.sources || [];
  } catch {}

  const items = sources.map(s => `
    <div class="card">
      <h2>${s.title}</h2>
      <p>${s.description || ""}</p>
      <a href="${s.path}">Open Source →</a>
    </div>
  `).join("");

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Sources</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body{background:#0b0b0e;color:#e5e7eb;font-family:system-ui;margin:0;padding:2rem}
h1{font-size:2rem}
.card{background:#111;padding:1.5rem;border-radius:16px;margin-bottom:1.25rem}
a{color:#9ae6ff;text-decoration:underline}
button{background:#1f2937;color:#e5e7eb;border:0;padding:.6rem 1.2rem;border-radius:999px}
</style>
</head>
<body>

<h1>SOURCES</h1>
<p>Sovereign containers. You own them.</p>

<div class="card">
  <button onclick="createSource()">＋ Create Source</button>
</div>

${items || "<p>No public sources yet.</p>"}

<p><a href="/portal/">← Back to Portal</a></p>

<script>
async function createSource(){
  const name = prompt("Source name (letters, numbers, dashes):");
  if(!name) return;

  const res = await fetch("/api/source/create",{
    method:"POST",
    headers:{ "Content-Type":"application/json" },
    body:JSON.stringify({ name })
  });

  if(res.ok){
    location.href="/sources/"+name+"/";
  } else {
    alert("Creation failed");
  }
}
</script>

</body>
</html>`);
}
