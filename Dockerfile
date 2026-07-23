# ─── Stage 1: Base Image ───────────────────────────────────
FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@10.12.1 --activate
WORKDIR /app

# ─── Stage 2: Workspace Dependencies & Build ────────────────
FROM base AS builder
WORKDIR /app

# Copy source code
COPY . .

# Install dependencies, generate Prisma Client & Build Application
ENV NEXT_TELEMETRY_DISABLED=1
ENV REDIS_URL="redis://localhost:6379"
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/grumeup?schema=public"
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
RUN pnpm install --frozen-lockfile --fetch-retries 10 --fetch-retry-maxtimeout 120000
RUN pnpm --filter @grumeup/database db:generate
RUN pnpm --filter @grumeup/web build

# ─── Stage 3: Production Runner Image ──────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone build output & static assets
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "apps/web/server.js"]
