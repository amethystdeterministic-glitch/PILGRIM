import path from "path";
import { renderIndex } from "./lib/render_index.js";

export function wireAutoLists(app, baseDir) {
  app.get("/pipeline", (_req, res) =>
    renderIndex(res, path.join(baseDir, "pipeline"), "PIPELINE")
  );

  app.get("/sources", (_req, res) =>
    renderIndex(res, path.join(baseDir, "sources"), "SOURCES")
  );

  app.get("/guards", (_req, res) =>
    renderIndex(res, path.join(baseDir, "guards"), "GUARDS")
  );
}
