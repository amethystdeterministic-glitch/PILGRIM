import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const app = express();
const PORT = 9190;
const ROOT = path.resolve('source/runtime');
const LEDGER = path.join(ROOT, 'source-ledger.ndjson');

app.use(express.json());

// 🔐 CORS — MUST COME FIRST
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ---------------- STATUS ----------------
app.get('/api/source/status', (_req, res) => {
  try {
    const count = fs.existsSync(LEDGER)
      ? fs.readFileSync(LEDGER, 'utf-8').trim().split('\n').length - 1
      : 0;

    res.json({
      ok: true,
      runtime: 'source',
      ledger: fs.existsSync(LEDGER),
      count,
      utc: new Date().toISOString()
    });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// ---------------- LIST ----------------
app.get('/api/source/list', (_req, res) => {
  if (!fs.existsSync(LEDGER)) {
    return res.json({ ok: true, sources: [] });
  }

  const sources = fs.readFileSync(LEDGER, 'utf-8')
    .trim()
    .split('\n')
    .map(JSON.parse)
    .filter(e => e.type === 'source.create')
    .map(e => ({
      id: e.payload.id,
      title: e.payload.title,
      description: e.payload.description,
      head: e.entry_hash,
      created_at: e.utc
    }));

  res.json({
    ok: true,
    schema: 'amethyst.source.list.v1',
    count: sources.length,
    sources
  });
});

app.listen(PORT, () => {
  console.log(`SOURCE runtime listening on ${PORT}`);
});
