import { exec } from "child_process";

export function createPage(req, res, ROOT) {
  const { source, page } = req.body || {};

  if (!source || !page || !/^[a-z0-9_-]+$/i.test(page)) {
    return res.status(400).json({ error: "Invalid page name" });
  }

  const cmd = `${process.env.HOME}/amethyst/runtime_v2/_page_template.sh ${source} ${page}`;

  exec(cmd, (err) => {
    if (err) {
      return res.status(500).json({ error: "Page creation failed" });
    }

    res.json({ ok: true, page });
  });
}
