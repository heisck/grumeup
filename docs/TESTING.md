# Testing Strategy

## Testing Pyramid

```
         ╱ E2E Tests ╲           (few, slow, high confidence)
        ╱──────────────╲
       ╱ Component Tests ╲       (moderate count)
      ╱────────────────────╲
     ╱  Integration Tests    ╲   (moderate count)
    ╱──────────────────────────╲
   ╱      Unit Tests             ╲  (many, fast, focused)
  ╱──────────────────────────────────╲
```

## Tools

| Layer | Tool | Location |
|---|---|---|
| Unit | Vitest | `src/**/*.test.ts` |
| Component | React Testing Library + Vitest | `src/**/*.test.tsx` |
| Integration | Vitest + MSW | `tests/integration/` |
| E2E | Playwright | `tests/e2e/` |
| Load | k6 | `tests/load/k6/` |
| API Mocking | MSW | Shared across layers |

## Running Tests

```bash
# Unit tests
pnpm run test:unit

# All tests
pnpm run test

# E2E tests
pnpm run test:e2e

# E2E tests with UI
pnpm run test:e2e:ui

# Load tests (requires k6 installed)
k6 run tests/load/k6/smoke.js
```

## Coverage Targets

| Metric | Target |
|---|---|
| Statements | ≥ 70% |
| Branches | ≥ 70% |
| Functions | ≥ 70% |
| Lines | ≥ 70% |

Coverage will increase as features are added.

## Writing Tests

### Unit Tests
- Test pure logic in isolation
- Mock external dependencies
- Fast execution (< 1ms per test)

### Component Tests
- Test React components with React Testing Library
- Focus on user behavior, not implementation
- Use `screen.getByRole()` over `getByTestId()`

### E2E Tests
- Test critical user flows end-to-end
- Run against the real application
- Keep the count low — focus on the happy path

### Load Tests
- Progressive stages: smoke → load → stress → spike
- Define thresholds for response time, error rate, throughput
- Run against a staging environment, not production
