# Code Style & Quality Guide

## Core Principles

1. **Maximum File Length**: No source file should exceed **300 lines of code**. Modularize logic into custom hooks, sub-components, or utility modules.
2. **Control Flow (Early Returns)**: Avoid deeply nested or chained `if/else` statements. Use guard clauses to return early.
3. **Component Reusability**: Extract reusable UI elements into `@grumeup/ui`. Never duplicate component implementations.
4. **Codebase Hygiene**: Clean up unused code, legacy helpers, or dead paths when updating existing code.

## TypeScript Guidelines

### Strict Mode
TypeScript strict mode is enabled globally (`strict: true`, `noUncheckedIndexedAccess: true`).

### No `any`
The `any` type is strictly forbidden. Biome enforces `noExplicitAny: error`. Use:
- `unknown` for unchecked runtime values
- Type guards / Zod schemas for narrowing
- Generics for reusable functions

### Imports
- Use path alias `@/` mapping to `src/`
- Use `import type { ... }` for type-only imports
- Import sorting is automatically handled by Biome

## Guard Clauses & Control Flow Example

❌ **Bad (Nested IFs)**:
```typescript
function processGroup(group: Group | null) {
  if (group) {
    if (group.isActive) {
      if (group.students.length > 0) {
        // ... process
      }
    }
  }
}
```

✅ **Good (Early Returns)**:
```typescript
function processGroup(group: Group | null): void {
  if (!group || !group.isActive || group.students.length === 0) {
    return;
  }
  
  // ... process clean logic
}
```

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
| Components | PascalCase | `GroupCard.tsx` |
| Hooks | kebab-case with `use-` prefix | `use-interview-queue.ts` |
| Utilities | kebab-case | `estimate-time.ts` |
| Types | kebab-case | `group-types.ts` |
| Constants | kebab-case | `queue-constants.ts` |
| Tests | Same as source + `.test` | `estimate-time.test.ts` |

## Component Conventions

- Prefer Server Components by default
- Mark Client Components explicitly with `"use client"`
- Colocate component-specific tests and helper types
- Use `cn()` from `@grumeup/ui` for conditional classes
