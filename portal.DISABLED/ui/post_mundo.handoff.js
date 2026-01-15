// View-level stub only. No transport.
export function formaliseFromMundo(messageId) {
  return {
    action: "open_post_composer",
    message_id: messageId,
    freeze_required: true
  };
}

export function contextualiseFromPost(messageId) {
  return {
    action: "open_mundo_thread",
    message_id: messageId
  };
}
