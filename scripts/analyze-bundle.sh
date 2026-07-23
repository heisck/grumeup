#!/usr/bin/env bash
set -euo pipefail

# ─── Bundle Size Analysis ─────────────────────────────────

echo "📊 Analyzing bundle size..."

ANALYZE=true pnpm --filter @grumeup/web build

echo "✅ Bundle analysis complete. Check the generated report."
