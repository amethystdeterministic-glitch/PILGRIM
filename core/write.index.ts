import { WriteDoc } from "./write.service";

export interface WriteIndexEntry {
  id: string;
  owner_identity: string;
  title: string;
  state: "draft" | "active" | "frozen";
  timestamp_updated: string;
}

export function indexWriteDoc(doc: WriteDoc): WriteIndexEntry {
  return {
    id: doc.id,
    owner_identity: doc.owner_identity,
    title: doc.title,
    state: doc.state,
    timestamp_updated: doc.timestamp_updated
  };
}
