# Security

## Reporting Vulnerabilities

If you discover a security vulnerability, please report it responsibly:
1. **Do not** open a public issue
2. Email security concerns to the project maintainers
3. Include a description of the vulnerability and steps to reproduce

## Security Architecture

### Defense in Depth

```
proxy.ts (headers, rate limiting)
    ↓
Server Actions / Route Handlers (authorization, validation)
    ↓
Database (parameterized queries via Prisma)
```

### Security Headers (proxy.ts)
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy (camera, microphone, geolocation disabled)
- Strict-Transport-Security (production only)

### Input Validation
All user input is validated with **Zod** schemas:
- Route handler request bodies
- Form submissions via Server Actions
- URL parameters and search params
- Environment variables (`src/lib/env.ts`)

### Environment Variables
- Validated at startup with Zod — app fails fast on invalid config
- Server/client schemas are separate to prevent secret leakage
- Never commit `.env` files — use `.env.example` as template

## Automated Security

| Tool | Purpose | Frequency |
|---|---|---|
| CodeQL | Static analysis | Every PR + weekly |
| Dependabot | Dependency updates | Weekly |
| npm audit | Known vulnerabilities | Every CI run |
| Biome | Code quality / suspicious patterns | Every commit |

## Best Practices

- Never rely on proxy.ts alone for authorization
- Always validate input on the server, even if validated on the client
- Use parameterized queries (Prisma handles this automatically)
- Keep dependencies up to date
- Review Dependabot PRs promptly
- Use `AUTH_SECRET` for session signing (never hardcode)
