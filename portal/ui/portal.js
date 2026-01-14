(() => {
  function route(r) {
    window.location.hash = "#" + r;
    render();
  }

  function render() {
    const main = document.getElementById("main");
    if (!main) return;

    const r = window.location.hash.replace("#", "") || "source";

    if (r === "core") {
      main.innerHTML = "<div id='core-root'></div>";
      return;
    }

    main.innerHTML = "<h2>" + r.toUpperCase() + "</h2>";
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-route]");
    if (!btn) return;
    route(btn.dataset.route);
  });

  document.addEventListener("DOMContentLoaded", render);
})();
