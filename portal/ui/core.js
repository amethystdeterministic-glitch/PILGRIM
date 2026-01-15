(() => {
  const state = {
    projects: [
      {
        project_id: "proj-1",
        name: "Personal",
        objects: []
      }
    ],
    activeProject: "proj-1",
    activeObject: null
  };

  function uuid() {
    return Math.random().toString(36).slice(2);
  }

  function render() {
    const main = document.getElementById("main");
    if (!main) return;

    const project = state.projects.find(p => p.project_id === state.activeProject);

    main.innerHTML = `
      <div style="display:flex; gap:16px;">
        <div style="width:20%;">
          <h3>Projects</h3>
          ${state.projects.map(p => `
            <div>
              <button onclick="CORE.selectProject('${p.project_id}')">${p.name}</button>
            </div>
          `).join("")}
          <button onclick="CORE.createProject()">+ Project</button>
        </div>

        <div style="width:30%;">
          <h3>Objects</h3>
          ${project.objects.map(o => `
            <div>
              <button onclick="CORE.selectObject('${o.object_id}')">
                ${o.type}: ${o.name}
              </button>
            </div>
          `).join("")}
          <button onclick="CORE.createObject()">+ Object</button>
        </div>

        <div style="width:50%;">
          <h3>Object Details</h3>
          ${state.activeObject ? renderDetails() : "<em>No object selected</em>"}
        </div>
      </div>
    `;
  }

  function renderDetails() {
    const obj = state.projects
      .flatMap(p => p.objects)
      .find(o => o.object_id === state.activeObject);

    if (!obj) return "";

    return `
      <p><strong>ID:</strong> ${obj.object_id}</p>
      <p><strong>Type:</strong> ${obj.type}</p>
      <p><strong>Created:</strong> ${obj.created_at}</p>
      <p><strong>Versions:</strong> 0</p>
    `;
  }

  window.CORE = {
    createProject() {
      const name = "Project " + (state.projects.length + 1);
      state.projects.push({
        project_id: uuid(),
        name,
        objects: []
      });
      render();
    },

    selectProject(id) {
      state.activeProject = id;
      state.activeObject = null;
      render();
    },

    createObject() {
      const project = state.projects.find(p => p.project_id === state.activeProject);
      if (!project) return;

      project.objects.push({
        object_id: uuid(),
        type: "WRITE",
        name: "New Object",
        created_at: new Date().toISOString(),
        working_state: "",
        versions: []
      });

      render();
    },

    selectObject(id) {
      state.activeObject = id;
      render();
    }
  };

  document.addEventListener("DOMContentLoaded", render);
})();
