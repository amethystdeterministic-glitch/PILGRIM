function debug(msg) {
  let el = document.getElementById("debug");
  if (!el) {
    el = document.createElement("div");
    el.id = "debug";
    el.style.cssText = "padding:8px;border-top:2px solid #000;font-family:monospace;font-size:12px";
    document.body.appendChild(el);
  }
  el.innerHTML += msg + "<br>";
}

debug("APP.JS LOADED");

function bindNav() {
  debug("BINDING NAV");
  document.querySelectorAll("nav button").forEach(btn => {
    btn.onclick = () => {
      debug("CLICK " + btn.dataset.route);
      const route = btn.dataset.route;
      if (route === "source") renderSourceHome();
      if (route === "pipeline") renderPipeline();
      if (route === "guards") renderGuards();
      if (route === "settings") renderSettings();
      bindNav();
    };
  });
}

function render(fn) {
  fn();
  bindNav();
}

document.addEventListener("DOMContentLoaded", () => {
  debug("DOM READY");
  render(renderSourceHome);
});
