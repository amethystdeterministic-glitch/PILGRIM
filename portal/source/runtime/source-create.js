import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const LEDGER = path.resolve('source/runtime/source-ledger.ndjson');

function utc() {
  return new Date().toISOString();
}

function hash(payload) {
  return crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
}

export function createSource({ id, title, description }) {
  if (!id || !title) {
    throw new Error('INVALID_SOURCE');
  }

  const entry = {
    schema: 'amethyst.source.entry.v1',
    type: 'source.create',
    utc: utc(),
    payload: {
      id,
      title,
      description: description || ''
    }
  };

  entry.entry_hash = hash(entry);

  fs.appendFileSync(LEDGER, JSON.stringify(entry) + '\n');

  return {
    ok: true,
    head: entry.entry_hash,
    id
  };
}
