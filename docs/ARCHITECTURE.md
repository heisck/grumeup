# System Architecture — GrumeUp (Gumi App)

## Overview

GrumeUp is a production-grade, real-time student group interview queue & dynamic calendar scheduling platform built as a Turborepo monorepo with pnpm workspaces, Next.js 16 (App Router), PostgreSQL + Prisma, Redis, Lenis, GSAP, and Progressive Web App (PWA) push notifications.

## System Topology & Flow

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
  ├── Seed Admin Auth (.env + Passkey / OAuth)      ├── Real-time Queue Status
  ├── Add Admins (Name, Email, Phone)               ├── Interview Time Window Estimate
  ├── Upload Student Groups (PDF, Excel, CSV, Docs) ├── "I'm Coming" Presence Toggle
  └── Trigger "Next Group" (PWA Push Broadcast)     └── Multi-Level Zoomable Calendar View
```

## Calendar Component Stack & Micro-Interaction Subsets

GrumeUp supports both standard scheduling UI (`BigCalendar` via `@grumeup/web`) and an immersive micro-interaction calendar layer (Month → Day Hours → Minute Slots):

### 1. Motion & Micro-Interaction System (GSAP & Lenis)
- **GSAP `quickTo` (Magnetic Pull)**: Optimized cursor and hover tracking on calendar date cells, hour slots, and student avatars.
- **Velocity & Inertia Tracking**: Using GSAP `InertiaPlugin` to calculate scroll velocity when scrubbing through hour/minute blocks.
- **FLIP Animation Pattern (First, Last, Invert, Play)**: Seamless position and scale calculations when zooming a date cell to full-screen 24-hour day view.
- **Lenis Scroll Instance Locking**: Locking layout scroll during zoom transitions so user wheel movements scrub through time increments rather than shifting the page.

### 2. High-Performance Rendering & Shader Subsets (Planned / Optional Layer)
- **FBO Texture Switching (Frame Buffer Objects)**: Off-screen buffer rendering to morph or dissolve date tiles as the user drills into hourly timelines.
- **Instanced Mesh Matrix Transforms**: Batch rendering date numbers and minute slots at 60+ FPS.
- **SDF Typography (Signed Distance Fields)**: Vector-sharp font rendering during deep zoom transitions.
- **Raycasting Spatial Hashing**: Precise interaction detection for 3D cursor picking across minute slots.

## Data Layer & Infrastructure

```
Browser / PWA Client
  │
  ▼
Next.js App Router (Server Actions & Route Handlers)
  │
  ├── Guard Clauses & Zod Validation
  ├── Redis Cache / Queue Manager (Fast reads & state broadcasts)
  └── PostgreSQL Database (Prisma ORM - Persistent store)
```
