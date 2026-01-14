import { MUNDO_MESSAGES } from "./mundo.data.js";

export function injectPostMessage(subject, body) {
  MUNDO_MESSAGES.post.push({
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    src: "post",
    body: `Subject: ${subject}\n${body}`
  });
}
