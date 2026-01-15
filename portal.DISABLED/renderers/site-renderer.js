export function renderSite(source, routePath = "/") {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Amethyst Portal</title>
  <style>
    body {
      background: #0b0f1a;
      color: #e6e9f0;
      font-family: system-ui, sans-serif;
      padding: 20px;
    }
    .card {
      background: #121833;
      border-radius: 16px;
      padding: 16px;
      margin-top: 14px;
    }
    .status {
      margin-top: 8px;
      font-size: 14px;
    }
    .ok {
      color: #4ade80;
    }
    .bad {
      color: #f87171;
    }
  </style>
</head>
<body>
  <h1>Amethyst Portal</h1>

  <div class="card">
    <h2>System</h2>
    <div id="system" class="status">Unavailable</div>
  </div>

  <div class="card">
    <h2>Source Head</h2>
    <div id="head" class="status">Unavailable</div>
  </div>

  <div class="card">
    <h2>Source Verify</h2>
    <div id="verify" class="status">Unavailable</div>
  </div>

  <script>
    async function loadStatus() {
      try {
        const res = await fetch('http://127.0.0.1:9190/api/source/status');
        const j = await res.json();

        if (j.ok) {
          document.getElementById('system').innerHTML =
            '<span class="ok">Available</span>';
          document.getElementById('verify').innerHTML =
            '<span class="ok">Ledger OK (' + j.count + ' entries)</span>';
        } else {
          throw new Error('Runtime not ok');
        }
      } catch (e) {
        document.getElementById('system').innerHTML =
          '<span class="bad">Unavailable</span>';
        document.getElementById('verify').innerHTML =
          '<span class="bad">Unavailable</span>';
      }
    }

    loadStatus();
  </script>
</body>
</html>`;
}
