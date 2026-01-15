import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const LEDGER = path.resolve('source/runtime/source-ledger.ndjson');

function hash(obj) {
  return crypto.createHash('sha256').update(JSON.stringify(obj)).digest('hex');
}

export function createSource({ title, description }) {
  if (!title) {
    return { ok: false, error: 'TITLE_REQUIRED' };
  }

  const id = crypto.randomUUID();
  const entry = {
    type: 'source.create',
    utc: new Date().toISOString(),
    payload: {
      id,
      title,
      description: description || ''
    }
  };

  entry.entry_hash = hash(entry);

  fs.mkdirSync(path.dirname(LEDGER), { recursive: true });
  fs.appendFileSync(LEDGER, JSON.stringify(entry) + '\n');

  return {
    ok: true,
    id,
    head: entry.entry_hash
  };
}
