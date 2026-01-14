import { Matrix } from "./matrix.engine";

export interface MatrixIndexEntry {
  id: string;
  owner_identity: string;
  name: string;
  state: "draft" | "active" | "frozen";
  timestamp_updated: string;
}

export function indexMatrix(m: Matrix): MatrixIndexEntry {
  return {
    id: m.id,
    owner_identity: m.owner_identity,
    name: m.name,
    state: m.state,
    timestamp_updated: m.timestamp_updated
  };
}
