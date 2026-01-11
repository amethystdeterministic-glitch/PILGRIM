#!/usr/bin/env bash
set -e

ops/tests/smoke.sh
ops/tests/flow.sh

echo "[+] ALL TESTS PASSED"
