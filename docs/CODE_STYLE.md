# Code Style Guide

## TypeScript

### Strict Mode
TypeScript strict mode is enabled globally. This includes:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`
- `noPropertyAccessFromIndexSignature: true`

### No `any`
The `any` type is forbidden. Biome enforces `noExplicitAny: error`. Use:
- `unknown` for truly unknown types
- Generics for flexible types
- Type guards for narrowing

### Imports
- Use path aliases: `@/` maps to `src/`
- Use `import type` for type-only imports
- Import order is enforced by Biome

## Formatting (Biome)

| Rule | Value |
|---|---|
| Indent | 2 spaces |
| Line width | 100 characters |
| Quotes | Double quotes |
| Semicolons | Always |
| Trailing commas | All |
| Line endings | LF |

## File Naming

| Type | Convention | Example |
|---|---|---|
| Components | PascalCase | `UserProfile.tsx` |
| Hooks | kebab-case with `use-` prefix | `use-auth.ts` |
| Utilities | kebab-case | `format-date.ts` |
| Types | kebab-case | `user-types.ts` |
| Constants | kebab-case | `api-routes.ts` |
| Tests | Same as source + `.test` | `use-auth.test.ts` |

## Component Conventions

- Prefer Server Components by default
- Mark Client Components explicitly with `"use client"`
- Colocate component-specific styles, tests, and types
- Use `cn()` from `@grumeup/ui` for conditional classes

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(auth): add Google OAuth login
fix(api): handle rate limit errors
docs(readme): add deployment instructions
refactor(cache): simplify TTL logic
test(auth): add login flow E2E tests
```
