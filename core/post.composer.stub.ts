import { CanonicalMessage } from "../core/adapter.interface";

export function createDraftMessage(input: {
  sender_identity: string;
  recipients: string[];
  subject?: string;
  body: string;
}): CanonicalMessage {
  return {
    id: crypto.randomUUID(),
    version: "0.1.0",
    state: "draft",
    sender_identity: input.sender_identity,
    recipient_identities: input.recipients,
    timestamp_created: new Date().toISOString(),
    content: {
      subject: input.subject ?? null,
      body: input.body,
      attachments: []
    },
    transport: {
      type: "internal",
      adapter: "post"
    }
  };
}

export function freezeMessage(msg: CanonicalMessage): CanonicalMessage {
  return {
    ...msg,
    state: "frozen",
    timestamp_frozen: new Date().toISOString(),
    proof: {
      hash: "sha256:PLACEHOLDER",
      prev: msg.proof?.hash ?? null
    }
  };
}
