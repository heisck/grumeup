#!/usr/bin/env bash
set -euo pipefail

# ─── Check for Circular Dependencies ──────────────────────

echo "🔍 Checking for circular dependencies..."

if ! command -v npx >/dev/null 2>&1; then
  echo "❌ npx is required"
  exit 1
fi

pnpm exec madge --circular --extensions ts,tsx apps/ packages/ 2>/dev/null

EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ No circular dependencies found"
else
  echo "❌ Circular dependencies detected!"
  exit 1
fi
