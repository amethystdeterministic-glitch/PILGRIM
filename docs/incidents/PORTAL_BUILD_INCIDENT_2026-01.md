# Amethyst Portal — Build Incident Record  
**Date:** 2026-01  
**Status:** Resolved by rollback to GREEN  
**Purpose:** Prevent recurrence of known failure modes

---

## Summary

During iterative development of the Amethyst Portal UI, a working GREEN state was unintentionally lost, resulting in approximately 12 hours of stalled progress. The issue was not a single bug, but a compound failure caused by violating established execution constraints.

This document records what went wrong, why it happened, and how to prevent it in future cycles.

---

## What Was the Last Known Good State (GREEN)

The system previously had:

- A functioning Portal UI
- Clickable navigation buttons
- Deterministic render flow
- No hidden state accumulation
- Verified JavaScript execution
- Tagged GREEN commit available in Git

This state did exist and was recoverable via Git tags.

---

## Primary Failure Causes

### 1. GREEN State Was Modified Instead of Branched

**What happened**
- Files inside a GREEN (frozen) build were edited directly
- Changes were made without an explicit unfreeze → work → refreeze cycle

**Why this matters**
- GREEN is a reference, not a workspace
- Editing GREEN removes the ability to reason about regressions
- Drift becomes invisible

**Prevention**
- GREEN builds must be read-only
- Any change requires a new branch or unfreeze declaration

---

### 2. Folder-Level Manual Editing Broke Determinism

**What happened**
- Individual files were edited inside folders (e.g. `portal/ui/index.html`, `portal.js`)
- Changes were applied without a full deterministic overwrite

**Why this matters**
- Partial edits create unknown state
- File placement errors become indistinguishable from logic errors
- Mobile + Termux amplifies this risk

**Prevention**
- Use whole-file HEREDOC replacements only
- Never “edit inside” folders during live execution
- One command = one known outcome

---

### 3. Server Route vs UI Path Confusion

**What happened**
- The Node server was serving one surface
- The browser was loading another
- UI assets (`/ui`) and root (`/`) were mixed

**Symptoms**
- HTML rendered but JS did not
- Inline scripts worked, external scripts appeared dead
- “Nothing changed” despite code updates

**Root cause**
- Static serving paths and script `src` paths were misaligned

**Prevention**
- Explicitly document:
  - What the server serves
  - Where UI lives
  - Absolute vs relative paths
- Never change routing mid-cycle

---

### 4. Debugging Occurred Inside the Execution Window

**What happened**
- Conceptual discussion, diagnosis, and fixes were mixed with execution steps
- Context saturation occurred
- Drift re-entered through explanation, not code

**Why this matters**
- Execution windows must remain mechanical
- Reasoning belongs elsewhere
- Mixing them causes circular debugging

**Prevention**
- Strict separation:
  - Execution window = commands only
  - Validation window = reasoning and decisions

---

### 5. Loss of Orientation After Regression

**What happened**
- Once the system regressed, effort focused on “making it work again”
- Instead of restoring GREEN immediately

**Why this matters**
- Recovery is always cheaper than repair
- Git tags existed but were not used immediately

**Prevention**
- First response to confusion:
  STOP → LIST TAGS → CHECKOUT LAST GREEN
- Never debug a broken state if a GREEN exists

---

## What This Was NOT

- Not a JavaScript logic problem
- Not a browser incompatibility
- Not a Termux limitation
- Not a capability issue
- Not user error

This was a process violation, not a technical failure.

---

## Canonical Lessons

1. GREEN is sacred  
2. Never edit GREEN  
3. Never partially edit files  
4. Never mix reasoning with execution  
5. Restore before debugging  
6. Determinism is procedural, not philosophical  

---

## Recovery Protocol

If similar symptoms appear:

1. Stop all changes  
2. Run `git tag --list`  
3. Identify last GREEN tag  
4. `git checkout <GREEN_TAG>`  
5. Verify behaviour  
6. Declare unfreeze before proceeding  

---

## Closing Note

This incident did not invalidate the architecture.  
It proved the necessity of the constraints already defined.

The system failed exactly where discipline was relaxed.

This document exists so that future versions of this work — and future versions of us — do not pay the same cost twice.
