# Contributing to GrumeUp

Thank you for your interest in contributing! This document provides guidelines and conventions to follow.

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Copy `.env.example` to `.env`
5. Start development: `pnpm run dev`

## Development Workflow

### Branch Naming
- `feat/description` — new features
- `fix/description` — bug fixes
- `docs/description` — documentation changes
- `refactor/description` — code refactoring
- `test/description` — test additions/changes
- `chore/description` — maintenance tasks

### Commit Messages
We enforce [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]
[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`, `build`, `revert`

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes following our code style
3. Write/update tests
4. Run `pnpm run check-all` to verify everything passes
5. Submit a pull request

### Before Submitting

Ensure all checks pass:

```bash
pnpm run typecheck      # TypeScript type checking
pnpm run lint           # Biome linting
pnpm run format:check   # Format verification
pnpm run test:unit      # Unit tests
```

## Code Style

- See [Code Style Guide](docs/CODE_STYLE.md) for detailed conventions
- Biome is the primary linter and formatter — run `pnpm run format` before committing
- Pre-commit hooks will automatically check staged files

## Vertical Slice Development

Features are built as vertical slices: database → API → UI → tests.

This means each feature includes:
1. Database schema changes (Prisma migration)
2. Server-side logic (Route Handlers / Server Actions)
3. Client-side UI
4. Tests at every level
