import { execFile } from "child_process";
import path from "path";

export function createSource(req, res, ROOT) {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    try {
      const data = JSON.parse(body);
      const name = (data.name || "").trim();

      if (!name || !/^[a-z0-9_-]+$/i.test(name)) {
        res.writeHead(400);
        return res.end("Invalid source name");
      }

      const script = path.join(ROOT, "_source_template.sh");

      execFile(script, [name], (err, stdout, stderr) => {
        if (err) {
          res.writeHead(500);
          return res.end(stderr || err.message);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ ok: true, source: name }));
      });
    } catch {
      res.writeHead(400);
      res.end("Bad request");
    }
  });
}
