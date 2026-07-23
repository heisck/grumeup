# GrumeUp — AI Agent Instructions & Code Standards

## Architecture & Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Web App**: `apps/web/` — Next.js 16 (App Router, Turbopack, PWA)
- **Packages**: `packages/` — shared libraries (`ui`, `database`, `cache`, `types`, `utils`, `config`)
- **Tests**: `tests/` — E2E (Playwright) and load tests (k6)

## System Vision — GrumeUp (Gumi App)

GrumeUp is a real-time student group interview queue & dynamic calendar scheduling platform.
- **Admin Capabilities**: Sourced initial admin credentials from `.env`. Admin management (add admins by Name, Email, Phone). File upload (PDF, Excel, CSV, Google Docs) for bulk student group assignment. Queue control ("Next Group" triggering PWA push notifications).
- **Student Capabilities**: Real-time status display (Current Group & Next Group), automated interview time estimation (based on average duration, e.g., 15 min slots), "I'm coming" presence indication.
- **UI Flow**: Dynamic multi-level Calendar (Month View → 24-Hour Day Timeline → Minute-level Slot View with avatars & estimated windows), Top Bar header with Search, Current Group div (prominent), and Next Group div.

## Core Agent Rules & Coding Standards

### File Size & Modular Design
- **Maximum 300 Lines Per File**: No file should exceed 300 lines of code. Keep code strictly modular. If a file approaches 300 lines, extract helper functions, hooks, or sub-components.
- **Component Reusability**: Always build modular, reusable UI components. Check `@grumeup/ui` and existing components before writing new UI elements. Never re-create components that already exist.

### Logic & Control Flow
- **No Chained or Deeply Nested `if` Statements**: Use early returns (`guard clauses`) to reduce nesting, increase readability, and enable fast execution paths.
- **Senior Developer Standards**: Think before touching any file. Write optimized, production-grade, unbloated TypeScript. No simplified or placeholder implementations.

### Codebase Hygiene & Cleanup
- **No Blind Deletions**: Never delete existing code without researching its purpose and dependencies. Ask if ambiguous.
- **Clean Up After Modifications**: When refactoring or replacing logic, eliminate dead code and obsolete implementations. Do not leave unused code alongside new implementations.

### TypeScript & Biome Conventions
- **Strict Mode Mandatory**: No `any` types. Biome enforces `noExplicitAny: error`. Use `unknown` or generics.
- **Path Aliases**: `@/` maps to `apps/web/src/`. Use `import type` for type-only imports.
- **Formatting**: Enforced by Biome (2-space indent, double quotes, semicolons, trailing commas). Run `pnpm run format` before committing.

### Commits & Workflow
- **Conventional Commits**: Format `type(scope): description` (e.g., `feat(queue): add next group push notification`).

## Forbidden Patterns
- ❌ Files exceeding 300 lines of code
- ❌ Deeply nested/chained `if` statements (must use early returns)
- ❌ Duplicate/re-created components instead of reusing existing ones
- ❌ `any` type annotations
- ❌ `console.log` in production code (use structured logger)
- ❌ Barrel files with `export *`
- ❌ Authorization logic only in `proxy.ts` — always enforce at data layer
- ❌ Direct database/Redis access outside `@grumeup/database` & `@grumeup/cache` packages

## Testing & Security
- **Testing**: Vitest (`*.test.ts`), React Testing Library, Playwright (`tests/e2e/`), k6 (`tests/load/k6/`), MSW.
- **Security**: Environment variables validated with Zod (`src/lib/env.ts`). Security headers set in `proxy.ts`. Inputs validated with Zod schemas.
