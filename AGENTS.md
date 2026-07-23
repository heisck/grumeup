# GrumeUp — AI Agent Instructions

## Architecture

- **Monorepo**: Turborepo + pnpm workspaces
- **Web App**: `apps/web/` — Next.js 16 (App Router, Turbopack)
- **Packages**: `packages/` — shared libraries consumed by apps
- **Tests**: `tests/` — E2E (Playwright) and load tests (k6)

## Coding Conventions

### TypeScript
- **Strict mode** is mandatory. No `any` types.
- Use `noUncheckedIndexedAccess` — always check indexed access results.
- Use path aliases: `@/` maps to `apps/web/src/`.
- Prefer `type` imports for type-only imports (`import type { Foo }`).

### File Naming
- Components: `PascalCase.tsx` (e.g., `UserProfile.tsx`)
- Utilities/hooks: `kebab-case.ts` (e.g., `use-auth.ts`)
- Route files: Next.js conventions (`page.tsx`, `layout.tsx`, `route.ts`)

### Formatting
- **Biome** is the formatter and linter (not ESLint/Prettier).
- 2-space indent, double quotes, semicolons, trailing commas.
- Run `pnpm run format` before committing.

### Commits
- Follow [Conventional Commits](https://www.conventionalcommits.org/).
- Format: `type(scope): description` (e.g., `feat(auth): add Google OAuth`)

## Forbidden Patterns
- ❌ `any` type annotations
- ❌ `console.log` in production code (use a logger)
- ❌ Barrel files with `export *` (Biome enforces this)
- ❌ Authorization logic only in `proxy.ts` — always enforce at data layer
- ❌ Synchronous `cookies()` or `headers()` calls (Next.js 16 uses async APIs)
- ❌ Direct database access outside `@grumeup/database` package
- ❌ Direct Redis access outside `@grumeup/cache` package

## Testing
- Unit tests: Vitest (`*.test.ts` / `*.spec.ts`)
- Component tests: React Testing Library + Vitest
- E2E tests: Playwright (`tests/e2e/`)
- Load tests: k6 (`tests/load/k6/`)
- API mocking: MSW

## Security
- Environment variables validated with Zod (`src/lib/env.ts`)
- Security headers set in `proxy.ts`
- Never trust client input — validate with Zod schemas
- Rate limiting applied at the proxy layer
