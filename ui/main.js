setTimeout(() => {
  document.getElementById("gate").hidden = true;
  document.getElementById("app").hidden = false;
  document.getElementById("proof").innerText =
    JSON.stringify({
      zite: "amethyst.deterministic",
      t_state: "T13",
      proof: "DETERMINISTIC_OK",
      timestamp: Date.now()
    }, null, 2);
}, 1500);
