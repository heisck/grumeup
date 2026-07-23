# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Monorepo scaffolding with Turborepo + pnpm workspaces
- Next.js 16 web application with App Router and Turbopack
- TypeScript strict mode across all packages
- Shared packages: database (Prisma), cache (Redis), UI, types, utils
- Biome linter and formatter
- Husky git hooks (pre-commit, pre-push, commit-msg)
- Commitlint with conventional commits
- Vitest for unit testing with React Testing Library
- Playwright for E2E testing
- k6 load testing scripts
- CI/CD pipeline (GitHub Actions)
- CodeQL security analysis
- Dependabot dependency updates
- Knip dead code detection
- Madge circular dependency detection
- Zod environment variable validation
- Security headers via proxy.ts
- Tailwind CSS 4 design system with oklch colors
- Comprehensive project documentation
