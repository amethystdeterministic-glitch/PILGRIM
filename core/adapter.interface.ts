/**
 * Adapter Interface
 * Protocol-agnostic ingestion & emission for Mundo / POST.
 * No UI. No storage mutation. Deterministic handoff only.
 */

export type AdapterType =
  | "internal"
  | "smtp"
  | "slack"
  | "teams"
  | "whatsapp"
  | "sms"
  | "custom";

export interface CanonicalMessage {
  id: string;
  version: string;
  state: "draft" | "sent" | "received" | "frozen";
  sender_identity: string;
  recipient_identities: string[];
  external_addresses?: string[];
  timestamp_created: string;
  timestamp_sent?: string | null;
  timestamp_frozen?: string | null;
  content: {
    subject?: string | null;
    body: string;
    attachments?: {
      name: string;
      hash: string;
      size: number;
    }[];
  };
  transport: {
    type: AdapterType;
    adapter: string;
    metadata?: Record<string, unknown>;
  };
  proof?: {
    hash: string;
    prev?: string | null;
  };
}

export interface InboundAdapter {
  type: AdapterType;
  ingest(payload: unknown): CanonicalMessage;
}

export interface OutboundAdapter {
  type: AdapterType;
  emit(message: CanonicalMessage): Promise<{ ok: boolean; ref?: string }>;
}
