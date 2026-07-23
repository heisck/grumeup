#!/usr/bin/env bash
set -euo pipefail

# ─── GrumeUp First-Time Setup ─────────────────────────────
# Run this script after cloning the repository.

echo "🚀 Setting up GrumeUp..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required. Install from https://nodejs.org"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required. Install with: npm install -g pnpm"; exit 1; }

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
  echo "❌ Node.js 22+ is required. Current: $(node -v)"
  exit 1
fi

echo "✅ Prerequisites met (Node $(node -v), pnpm $(pnpm -v))"

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Copy environment variables
if [ ! -f .env ]; then
  echo "📋 Creating .env from .env.example..."
  cp .env.example .env
  echo "⚠️  Edit .env with your actual values before starting"
else
  echo "✅ .env already exists"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
pnpm --filter @grumeup/database db:generate || echo "⚠️  Prisma generate skipped (database may not be available)"

# Setup Husky
echo "🐶 Setting up git hooks..."
pnpm exec husky || true

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Edit .env with your database and Redis URLs"
echo "  2. Start PostgreSQL and Redis"
echo "  3. Run: pnpm run dev"
echo ""
