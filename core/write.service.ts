import crypto from "crypto";

export type WriteState = "draft" | "active" | "frozen";

export interface WriteDoc {
  id: string;
  version: string;
  state: WriteState;
  owner_identity: string;
  timestamp_created: string;
  timestamp_updated: string;
  timestamp_frozen?: string | null;
  title: string;
  content: { format: "markdown" | "plain"; body: string };
  history: { version: string; timestamp: string; hash: string }[];
  proof?: { hash: string; prev?: string | null };
}

export function createWriteDoc(input: {
  owner_identity: string;
  title: string;
  body: string;
  format?: "markdown" | "plain";
}): WriteDoc {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    version: "0.1.0",
    state: "draft",
    owner_identity: input.owner_identity,
    timestamp_created: now,
    timestamp_updated: now,
    title: input.title,
    content: { format: input.format ?? "markdown", body: input.body },
    history: []
  };
}

export function updateWriteDoc(doc: WriteDoc, body: string): WriteDoc {
  if (doc.state === "frozen") throw new Error("Document is frozen");
  const now = new Date().toISOString();
  return {
    ...doc,
    state: "active",
    timestamp_updated: now,
    content: { ...doc.content, body }
  };
}

export function freezeWriteDoc(doc: WriteDoc): WriteDoc {
  if (doc.state === "frozen") return doc;
  const now = new Date().toISOString();
  const hash = crypto.createHash("sha256").update(doc.content.body).digest("hex");
  return {
    ...doc,
    state: "frozen",
    timestamp_frozen: now,
    history: [
      ...doc.history,
      { version: doc.version, timestamp: now, hash }
    ],
    proof: { hash, prev: doc.proof?.hash ?? null }
  };
}
