# Caching Strategy

## Overview

GrumeUp uses a multi-layer caching strategy to minimize latency and database load.

## Cache Layers

```
1. Browser Cache
   ├── HTTP Cache-Control headers
   └── Service Worker (future)
        ↓ miss
2. TanStack Query (Client)
   ├── In-memory cache
   ├── Stale time: 60 seconds
   └── Automatic refetching
        ↓ miss
3. Next.js Cache (Server)
   ├── Full Route Cache
   ├── Data Cache
   └── Router Cache
        ↓ miss
4. Redis Cache
   ├── Shared across instances
   ├── TTL-based expiration
   └── Pattern-based invalidation
        ↓ miss
5. PostgreSQL
   └── Source of truth
```

## Redis Usage

```typescript
import { cache } from "@grumeup/cache";

// Set with 5-minute TTL
await cache.set("user:123", userData, 300);

// Get (returns null on miss)
const user = await cache.get<User>("user:123");

// Delete
await cache.del("user:123");

// Invalidate all user keys
await cache.invalidatePattern("user:*");
```

## Cache Invalidation

- **Time-based**: TTL expiration (default: 1 hour)
- **Event-based**: Invalidate on write operations
- **Pattern-based**: Clear related keys using wildcards

## Best Practices

- Cache reads aggressively, invalidate on writes
- Use short TTLs for frequently changing data
- Use long TTLs for static/configuration data
- Never cache sensitive data (auth tokens, PII) without encryption
- Monitor cache hit rates in production
- Set up Redis persistence for crash recovery
