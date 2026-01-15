# POST v1 with CALAN Embedded — Canon Spec

Status: DESIGN-LOCK  
Scope: Core lifecycle + time authority + deterministic proof (no transport, no UI)

---

## 1. Definition

POST v1 is a deterministic communications + obligation lifecycle engine.

CALAN is embedded inside POST as the time + obligation authority. CALAN is not a sibling app.

Mundo renders POST state.  
Aether issues POST intents.

---

## 2. Canon State Machines

### 2.1 Message lifecycle (transport + proof)

- DRAFT (red)
- QUEUED (yellow) — created locally, pending send
- DISPATCHED (yellow) — handed to transport adapter
- ACKED (yellow) — recipient runtime confirmed receipt
- NOTICED (yellow) — rendered to recipient surface (Mundo)
- RESOLVED (green) — terminal (closed/fulfilled)
- FAILED (red) — terminal unless retried

Rule: message lifecycle is independent of obligation lifecycle.

### 2.2 Obligation lifecycle (CALAN-owned)

- PROPOSED (yellow)
- ACCEPTED (yellow)
- DECLINED (green terminal)
- DEFERRED (yellow) — new due window created
- DUE (yellow)
- OVERDUE (red)
- COMPLETED (green terminal)
- EXPIRED (green terminal)

Rule: An obligation always references a message as origin proof.

---

## 3. Canon Objects

### 3.1 POST.Message

- message_id
- from_identity
- to_identities[]
- subject
- body
- created_at (CALAN timestamp)
- state (Message lifecycle)
- proof_chain[] (event chain)

### 3.2 POST.Obligation (CALAN embedded)

- obligation_id
- message_id (origin)
- owner_identity (who must act)
- counterparty_identity (who benefits / is notified)
- title
- due_at (CALAN)
- window (grace/escalation rules)
- state (Obligation lifecycle)
- version_lineage[] (Canon version chain)

### 3.3 CALAN.TimeAuthority (internal to POST)

- home_tz
- day_state
- calendar_days_elapsed
- DST-safe recurrence & window math

---

## 4. Deterministic Proof Event Log

POST is driven by append-only events:

Message events:
- MESSAGE_CREATED
- MESSAGE_QUEUED
- MESSAGE_DISPATCHED
- MESSAGE_ACKED
- MESSAGE_NOTICED
- MESSAGE_FAILED
- MESSAGE_RESOLVED

Obligation events:
- OBLIGATION_PROPOSED
- OBLIGATION_ACCEPTED
- OBLIGATION_DECLINED
- OBLIGATION_DEFERRED
- OBLIGATION_DUE
- OBLIGATION_OVERDUE
- OBLIGATION_COMPLETED
- OBLIGATION_EXPIRED

Each event includes:
- event_id
- timestamp (CALAN)
- actor_identity
- payload_hash
- prev_hash (chain)

This event chain is the basis for Deterministic Proof in communications.

---

## 5. Canon Interfaces (no UI, no transport coupling)

### 5.1 POST Core API (v1)

- post.create_message(draft) -> message_id
- post.queue(message_id) -> ok
- post.dispatch(message_id) -> ok     (adapter performs send)
- post.ack(message_id, recipient_proof) -> ok
- post.notice(message_id, surface_proof) -> ok
- post.fail(message_id, error) -> ok
- post.resolve(message_id, reason) -> ok

### 5.2 CALAN inside POST (v1)

- post.propose_obligation(message_id, obligation_spec) -> obligation_id
- post.accept_obligation(obligation_id) -> ok
- post.decline_obligation(obligation_id) -> ok
- post.defer_obligation(obligation_id, new_due_at) -> ok
- post.complete_obligation(obligation_id) -> ok
- post.tick_daystate(now) -> emits due/overdue transitions

CALAN remains embedded: POST calls CALAN for time math + day transitions.

---

## 6. Mundo relationship (render-only)

Mundo does not send. Mundo does not decide.

Mundo renders:
- inbox threads
- obligation lists (proposed/due/overdue/completed)
- state badges (queued/dispatched/ack/noticed/etc.)
- proof view (later)

Mundo consumes only:
- post.list_threads(identity)
- post.list_messages(thread_id)
- post.list_obligations(identity, filter)
- post.get_message(message_id)
- post.get_obligation(obligation_id)

---

## 7. Aether relationship (intent-only)

Aether issues intent commands, never “email” semantics.

Examples:
- open post
- compose to <identity>
- propose obligation "<title>" due <date>
- show due today
- show overdue

Aether maps intent -> POST APIs (transport-agnostic).

---

## 8. Scope Lock

IN (v1):
- lifecycle + states
- event log + proof chain
- CALAN time authority embedded
- local queue model
- read queries for Mundo
- intent mapping for Aether

OUT (later phases):
- SMTP/IMAP hosting
- provider federation
- ASNL transport adapters
- encryption / key exchange specifics
- reputation / anti-abuse
- complex multi-device sync beyond simple replay
