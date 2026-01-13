import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEDGER = path.join(__dirname, 'source-ledger.ndjson');

export function listSources() {
  if (!fs.existsSync(LEDGER)) return [];

  const lines = fs.readFileSync(LEDGER, 'utf8')
    .trim()
    .split('\n')
    .filter(Boolean);

  const sources = [];

  for (const line of lines) {
    try {
      const entry = JSON.parse(line);
      if (entry.type === 'source.create') {
        sources.push({
          id: entry.payload.id,
          title: entry.payload.title,
          description: entry.payload.description || '',
          head: entry.entry_hash,
          created_at: entry.utc
        });
      }
    } catch {}
  }

  return sources;
}
