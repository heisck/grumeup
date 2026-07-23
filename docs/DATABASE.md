# Database

## Overview

- **ORM**: Prisma 7.x
- **Database**: PostgreSQL 16+
- **Package**: `@grumeup/database`

## Schema Location

The Prisma schema is at `packages/database/prisma/schema.prisma`.

## Commands

```bash
# Generate Prisma client after schema changes
pnpm --filter @grumeup/database db:generate

# Push schema to database (development)
pnpm --filter @grumeup/database db:push

# Create a migration (production-safe)
pnpm --filter @grumeup/database db:migrate

# Open Prisma Studio (GUI)
pnpm --filter @grumeup/database db:studio
```

## Client Usage

```typescript
import { prisma } from "@grumeup/database";

// The client is a singleton — safe for hot reloads in development
const users = await prisma.user.findMany();
```

## Best Practices

### Indexing
- Always index foreign keys
- Index columns used in `WHERE`, `ORDER BY`, and `JOIN`
- Use composite indexes for multi-column queries
- Monitor slow queries and add indexes as needed

### Migrations
- Use `prisma migrate dev` for development
- Use `prisma migrate deploy` in production CI/CD
- Review generated SQL before applying

### Query Optimization
- Use `select` to fetch only needed fields
- Use `include` carefully — avoid N+1 queries
- Prefer `findMany` with pagination over unbounded queries
- Use raw queries for complex analytics if needed

### Connection Pooling
The Prisma client uses a singleton pattern to prevent connection exhaustion during Next.js hot reloads. In production, consider:
- Prisma Accelerate (managed connection pooling)
- PgBouncer (self-hosted connection pooling)
