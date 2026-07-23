# System Architecture — GrumeUp (Gumi App)

## Overview

GrumeUp is a production-grade, real-time student group interview queue & scheduling system. Built as a Turborepo monorepo with pnpm workspaces, Next.js 16 (App Router), PostgreSQL + Prisma, Redis, and Progressive Web App (PWA) push notification support.

## Key Modules & User Roles

```
                      ┌─────────────────────────────────────────┐
                      │              GrumeUp App                │
                      └────────────────────┬────────────────────┘
                                           │
                  ┌────────────────────────┴────────────────────────┐
                  ▼                                                 ▼
        ┌──────────────────┐                               ┌──────────────────┐
        │   Admin Portal   │                               │  Student Portal  │
        └─────────┬────────┘                               └────────┬─────────┘
                  │                                                 │
  ├── Admin Auth (.env + Passkey / OAuth)           ├── Real-time Queue View
  ├── Manage Admins (Name, Email, Phone)            ├── Estimated Interview Time
  ├── Bulk Group Upload (PDF, Excel, CSV, Docs)     ├── "I'm Coming" Status Toggle
  └── Trigger "Next Group" (PWA Web Push)           └── Interactive Multi-level Calendar
```

## System Workflow & UI Layout

1. **Top Bar Header**: System Branding ("Gumi App / GrumeUp"), Search Bar (students, groups, time slots), Current Group Banner (prominent display), and Next Group Banner (preview slot).
2. **Interactive Zoomable Calendar**:
   - **Month Overview**: Grid view of days (1st – 30th/31st).
   - **Day Zoom (Date Click)**: 24-Hour timeline breakdown (12:00 AM – 11:59 PM).
   - **Hour Zoom (Hour Click)**: Minute-level interval slots (e.g. 1:00 PM – 1:59 PM) displaying scheduled groups, student avatars, estimated start/end times, and status badges.
3. **Queue & Estimation Engine**:
   - Group slots configured by Admin (e.g., 15 minutes per group).
   - Dynamic time estimation calculated using average interview duration and position in queue.
   - PWA Web Push Notifications broadcast to offline/online students when their group is called up.

## Monorepo Architecture

```
apps/web/               # Next.js 16 App Router + PWA Service Worker
├── src/app/            # App Router routes (Auth, Admin, Student Queue, Calendar)
├── src/components/     # Modular client/server components (<300 lines each)
├── src/hooks/          # Custom React hooks
└── src/lib/            # Utilities, env schemas, query client setup

packages/
├── ui/                 # Shared UI components (shadcn/ui, Tailwind CSS 4)
├── database/           # Prisma client, PostgreSQL schema & migrations
├── cache/              # Redis client + ioredis queue caching
├── types/              # Shared TypeScript interfaces & Zod schemas
└── utils/              # Shared helper functions & estimation algorithms
```

## Data Flow

```
User (Browser / PWA)
  │
  ▼
Next.js App Router (Server Components & Server Actions)
  │
  ├── Guard Clauses & Zod Validation
  ├── Redis Cache / Queue Manager (Fast reads & state broadcasts)
  └── PostgreSQL Database (Prisma ORM - Persistent store)
```
