import crypto from "crypto";

export type MatrixState = "draft" | "active" | "frozen";
export type ColumnType = "number" | "string" | "boolean" | "date";

export interface MatrixColumn { key: string; type: ColumnType; }
export interface MatrixRow { id: string; cells: Record<string, any>; }

export interface Matrix {
  id: string;
  version: string;
  state: MatrixState;
  owner_identity: string;
  timestamp_created: string;
  timestamp_updated: string;
  timestamp_frozen?: string | null;
  name: string;
  columns: MatrixColumn[];
  rows: MatrixRow[];
  history: { version: string; timestamp: string; hash: string }[];
  proof?: { hash: string; prev?: string | null };
}

export function createMatrix(owner: string, name: string, columns: MatrixColumn[]): Matrix {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    version: "0.1.0",
    state: "draft",
    owner_identity: owner,
    timestamp_created: now,
    timestamp_updated: now,
    name,
    columns,
    rows: [],
    history: []
  };
}

export function upsertRow(m: Matrix, row: MatrixRow): Matrix {
  if (m.state === "frozen") throw new Error("Matrix frozen");
  const now = new Date().toISOString();
  const rows = m.rows.filter(r => r.id !== row.id).concat(row);
  return { ...m, state: "active", rows, timestamp_updated: now };
}

export function freezeMatrix(m: Matrix): Matrix {
  if (m.state === "frozen") return m;
  const now = new Date().toISOString();
  const payload = JSON.stringify({ columns: m.columns, rows: m.rows });
  const hash = crypto.createHash("sha256").update(payload).digest("hex");
  return {
    ...m,
    state: "frozen",
    timestamp_frozen: now,
    history: m.history.concat({ version: m.version, timestamp: now, hash }),
    proof: { hash, prev: m.proof?.hash ?? null }
  };
}
