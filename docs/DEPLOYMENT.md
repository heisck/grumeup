# Deployment

## Prerequisites

- Node.js 22 LTS
- pnpm 10+
- PostgreSQL 16+
- Redis 7+

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill in all required values
3. Ensure database and Redis are accessible

## Build

```bash
pnpm install --frozen-lockfile
pnpm run build
```

## Start

```bash
pnpm run start
```

The app runs on port 3000 by default.

## Deployment Options

### Vercel (Recommended for simplicity)
- Connect your GitHub repository
- Vercel auto-detects the monorepo structure
- Set environment variables in the Vercel dashboard
- Automatic deployments on push to `main`

### Docker (Self-hosted)
Docker configuration will be added in Phase 5. It will include:
- Multi-stage build for minimal image size
- Docker Compose for local development
- Trivy scanning for container vulnerabilities

### Production Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Redis accessible
- [ ] HTTPS enabled
- [ ] Security headers verified
- [ ] Error tracking configured
- [ ] Monitoring dashboards set up
- [ ] Load testing completed
- [ ] Backup strategy in place
