# Architecture

## Overview

GrumeUp is a monorepo managed by **Turborepo** with **pnpm** workspaces. The architecture follows a modular design where shared logic lives in packages and applications consume them.

## Dependency Graph

```
apps/web
├── @grumeup/ui        (shared components)
├── @grumeup/database  (Prisma client)
├── @grumeup/cache     (Redis client)
├── @grumeup/types     (shared types)
└── @grumeup/utils     (shared utilities)
```

## Data Flow

```
Browser
  │
  ▼
Next.js App Router (Server Components)
  │
  ├── Server Actions / Route Handlers
  │     │
  │     ├── Zod Validation
  │     │
  │     ├── Redis Cache ──── Cache Hit? ──── Return cached
  │     │                         │
  │     │                    Cache Miss
  │     │                         │
  │     └── Prisma ORM ──── PostgreSQL
  │
  └── Client Components
        │
        └── TanStack Query (client-side cache)
```

## Caching Strategy

```
1. Browser Cache (HTTP headers)
     ↓ miss
2. TanStack Query (client memory)
     ↓ miss
3. Next.js Cache (server-side, ISR)
     ↓ miss
4. Redis Cache (shared, TTL-based)
     ↓ miss
5. PostgreSQL (source of truth)
```

## Security Architecture

- **proxy.ts**: First layer — sets security headers, rate limiting, redirects
- **Server Actions / Route Handlers**: Second layer — authorization, input validation
- **Database**: Third layer — row-level security (future), parameterized queries (Prisma)

> **Critical**: Never rely solely on proxy.ts for authorization. Always enforce at the data layer.

## Package Responsibilities

| Package | Purpose |
|---|---|
| `@grumeup/database` | Prisma client singleton, schema, migrations |
| `@grumeup/cache` | Redis client singleton, typed cache helpers |
| `@grumeup/ui` | shadcn/ui components, design system utilities |
| `@grumeup/types` | Shared TypeScript interfaces and types |
| `@grumeup/utils` | Pure utility functions |
| `@grumeup/config` | Shared TypeScript configurations |
