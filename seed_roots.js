import fs from "fs";
import path from "path";

export function seedRoots(baseDir) {
  const roots = ["fun", "pipeline", "sources", "guards"];

  for (const r of roots) {
    const p = path.join(baseDir, r);
    if (!fs.existsSync(p)) {
      fs.mkdirSync(p, { recursive: true });
    }
  }
}
