import { loadForge, isForgeReady } from "./forge-loader.js";

const view = document.getElementById("portal-view");

/*
  Deterministic State
*/

let sourceState = {
  status: "draft",
  version: 1
};

let familyGuard = {
  active: false,
  capsule: "adult"
};

/*
  Enforcement
*/

function enforce(route) {
  if (!familyGuard.active) return true;

  if (familyGuard.capsule === "child") {
    const blocked = ["write", "matrix", "mundo"];
    if (blocked.includes(route)) return false;
  }
  return true;
}

/*
  Views
*/

const views = {
  forge: () => `
    <h2>FORGE</h2>
    <p>Build your SOURCE here.</p>

    <p>Engine:
      <strong>${isForgeReady() ? "FORGE ready" : "FORGE loading…"}</strong>
    </p>

    <p>Status:
      <strong>${sourceState.status === "draft"
        ? "Draft — private by default"
        : "Published — locked"}</strong>
    </p>

    ${sourceState.status === "draft"
      ? `<button id="publishBtn">Publish to SOURCE</button>`
      : `<button id="reviseBtn">Create revision</button>`
    }
  `,

  source: () => `
    <h2>SOURCE</h2>
    <p>Published from FORGE.</p>
    <p>Status:
      <strong>${sourceState.status === "published"
        ? "Published — public"
        : "Not published"}</strong>
    </p>
    <p>Version: ${sourceState.version}</p>
  `,

  familyguard: () => `
    <h2>FamilyGuard</h2>
    <p>Status:
      <strong>${familyGuard.active ? "Active" : "Inactive"}</strong>
    </p>
    <p>Capsule:
      <strong>${familyGuard.capsule}</strong>
    </p>

    <button id="toggleFG">
      ${familyGuard.active ? "Deactivate" : "Activate"} FamilyGuard
    </button>
    <button id="setAdult">Adult Capsule</button>
    <button id="setChild">Child Capsule</button>
  `,

  write: () => `<h2>Write</h2><p>Creation tool.</p>`,
  matrix: () => `<h2>Matrix</h2><p>Structured thinking space.</p>`,
  mundo: () => `<h2>Mundo</h2><p>Organisation and flow.</p>`
};

/*
  Router
*/

function routeTo(name) {
  if (!views[name]) return;

  if (!enforce(name)) {
    view.innerHTML = `
      <h2>Unavailable</h2>
      <p>This action cannot execute in the current identity.</p>
    `;
    return;
  }

  view.innerHTML = views[name]();
  wireActions();
}

function wireActions() {
  const publishBtn = document.getElementById("publishBtn");
  const reviseBtn = document.getElementById("reviseBtn");
  const toggleFG = document.getElementById("toggleFG");
  const setAdult = document.getElementById("setAdult");
  const setChild = document.getElementById("setChild");

  if (publishBtn) {
    publishBtn.onclick = () => {
      sourceState.status = "published";
      routeTo("forge");
    };
  }

  if (reviseBtn) {
    reviseBtn.onclick = () => {
      sourceState.status = "draft";
      sourceState.version += 1;
      routeTo("forge");
    };
  }

  if (toggleFG) {
    toggleFG.onclick = () => {
      familyGuard.active = !familyGuard.active;
      routeTo("familyguard");
    };
  }

  if (setAdult) {
    setAdult.onclick = () => {
      familyGuard.capsule = "adult";
      routeTo("familyguard");
    };
  }

  if (setChild) {
    setChild.onclick = () => {
      familyGuard.capsule = "child";
      routeTo("familyguard");
    };
  }
}

/*
  Boot
*/

(async () => {
  await loadForge();
  routeTo("forge");
})();

document.querySelectorAll("[data-route]").forEach(btn => {
  btn.addEventListener("click", () => {
    routeTo(btn.dataset.route);
  });
});
