import fs from "fs";
import path from "path";

export function handleCreateSource(req, res) {
  let body = "";

  req.on("data", chunk => {
    body += chunk.toString();
  });

  req.on("end", () => {
    const ts = Date.now().toString();
    const dir = path.join(process.cwd(), "sources", ts);

    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, "index.html"),
      body,
      "utf8"
    );

    res.writeHead(302, {
      Location: `/sources/${ts}/`
    });
    res.end();
  });
}
