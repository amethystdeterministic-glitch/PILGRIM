#!/usr/bin/env bash
set -euo pipefail

TARGET="${1:-amethyst-browser-android}"

AUTH_DIR="authority/${TARGET}"
GEN_DIR="generated/${TARGET}"

echo "== D.R.E. Gate =="
echo "Target: ${TARGET}"
echo

# 0) Preconditions
if [ ! -d "${AUTH_DIR}" ]; then
  echo "ERROR: Missing authority bundle: ${AUTH_DIR}"
  echo "Run the authority freeze first (authority-*-v1)."
  exit 1
fi

if [ ! -f "${AUTH_DIR}/proof.json" ] || [ ! -f "${AUTH_DIR}/proof.sig" ] || [ ! -f "${AUTH_DIR}/runtime.policy.json" ]; then
  echo "ERROR: Authority bundle incomplete in ${AUTH_DIR}"
  exit 1
fi

# 1) Regenerate deterministic artefact
echo "1) Forge: generating fresh artefact..."
cargo run -p forge -- "${TARGET}"
echo

# 2) Verify freshly generated proof
echo "2) Verifier: checking fresh proof..."
cargo run -p pilgrim-verifier -- "${GEN_DIR}/proof.json"
echo

# 3) Check authority freeze is still valid (verifier must PASS)
echo "3) Verifier: checking AUTHORITY freeze..."
cargo run -p pilgrim-verifier -- "${AUTH_DIR}/proof.json"
echo

# 4) Authority lock check: ensure runtime policy hasn't drifted
echo "4) Authority lock: runtime.policy.json must match exactly..."
sha_gen="$(sha256sum "${GEN_DIR}/runtime.policy.json" | awk '{print $1}')"
sha_auth="$(sha256sum "${AUTH_DIR}/runtime.policy.json" | awk '{print $1}')"

echo "   generated sha256: ${sha_gen}"
echo "   authority  sha256: ${sha_auth}"

if [ "${sha_gen}" != "${sha_auth}" ]; then
  echo "ERROR: Runtime policy drift detected."
  echo "This is expected ONLY if you intentionally changed policy."
  echo "If intentional: update authority with a new tag/version."
  exit 1
fi
echo "   OK: policy matches authority"
echo

# 5) Tamper test: modify a copy of proof.json and confirm verifier FAILS
echo "5) Tamper test: signature MUST FAIL if proof.json changes..."
tmpdir="$(mktemp -d)"
cp "${GEN_DIR}/proof.json" "${tmpdir}/proof.json"
cp "${GEN_DIR}/proof.sig"  "${tmpdir}/proof.sig"
cp "${GEN_DIR}/runtime.policy.json" "${tmpdir}/runtime.policy.json"

# flip one byte in proof.json (safe minimal edit)
# replace first occurrence of "DETERMINISTIC" with "DETERMINIST1C"
sed -i '0,/DETERMINISTIC/s//DETERMINIST1C/' "${tmpdir}/proof.json" || true

set +e
cargo run -p pilgrim-verifier -- "${tmpdir}/proof.json" >/dev/null 2>&1
rc=$?
set -e

if [ $rc -eq 0 ]; then
  echo "ERROR: Tamper test unexpectedly PASSED. This must NEVER happen."
  exit 1
fi

echo "   OK: tamper caused FAIL (as required)"
echo

echo "✅ D.R.E. Gate: PASS"
