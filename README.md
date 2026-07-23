# GrumeUp

A production-quality web application built with modern tooling and best practices.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | PostgreSQL + Prisma 7 |
| Cache | Redis + ioredis |
| State | TanStack Query v5 |
| Animation | GSAP + Framer Motion |
| 3D | Three.js + React Three Fiber + Drei |
| Testing | Vitest + Playwright + MSW |
| Quality | Biome + Knip + Madge |
| CI/CD | GitHub Actions + CodeQL + Dependabot |
| Monorepo | Turborepo + pnpm workspaces |

## Quick Start

```bash
# Clone the repository
git clone https://github.com/heisck/grumeup.git
cd grumeup

# Install dependencies (requires pnpm and Node.js 22+)
pnpm install

# Copy environment variables
cp .env.example .env

# Start development
pnpm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
grumeup/
├── apps/web/          # Next.js 16 web application
├── packages/
│   ├── ui/            # Shared UI components (shadcn/ui)
│   ├── database/      # Prisma client + schema
│   ├── cache/         # Redis client + helpers
│   ├── config/        # Shared TypeScript configs
│   ├── types/         # Shared TypeScript types
│   └── utils/         # Shared utilities
├── tests/             # E2E and load tests
├── docs/              # Documentation
├── scripts/           # Dev and CI scripts
└── .github/           # CI/CD workflows
```

## Scripts

| Command | Description |
|---|---|
| `pnpm run dev` | Start all apps in development mode |
| `pnpm run build` | Build all apps for production |
| `pnpm run lint` | Lint all packages |
| `pnpm run format` | Format all files |
| `pnpm run typecheck` | Type check all packages |
| `pnpm run test:unit` | Run unit tests |
| `pnpm run test:e2e` | Run E2E tests |
| `pnpm run knip` | Detect dead code |
| `pnpm run madge` | Check circular dependencies |
| `pnpm run check-all` | Run all checks (typecheck + lint + format + tests) |

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Contributing](CONTRIBUTING.md)
- [Code Style](docs/CODE_STYLE.md)
- [Testing](docs/TESTING.md)
- [Security](docs/SECURITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [API](docs/API.md)
- [Database](docs/DATABASE.md)
- [Cache](docs/CACHE.md)
- [Development Plan](docs/PLAN.md)
- [Progress Tracking](docs/PROGRESS.md)

## License

[MIT](LICENSE) © heisck