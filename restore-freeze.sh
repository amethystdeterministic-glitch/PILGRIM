#!/usr/bin/env bash
set -e

echo "🔒 Restoring verified Portal + Source runtime state..."

git fetch --tags
git checkout portal-freeze-2026-01-13

echo "✅ Repository restored to frozen state"
