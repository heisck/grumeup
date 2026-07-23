# GrumeUp Development Plan

## Phase 1 — Project Scaffolding ✅
- Monorepo setup (Turborepo + pnpm)
- Next.js 16 with App Router & strict TypeScript config
- Shared workspace packages (`ui`, `database`, `cache`, `types`, `utils`, `config`)
- Quality tooling (Biome linter/formatter, Knip, Madge, Husky)
- E2E & Unit testing foundation

## Phase 2 — System Data Models & Database Schema
- Define Prisma schema for:
  - `Admin` (Name, Email, Phone, Passkey hash, Role)
  - `Student` (Name, Email, Phone, Group ID, Status)
  - `Group` (Group Number/Name, Scheduled Date, Time Slot, Duration)
  - `InterviewSession` (Active Group ID, Average Duration, Status)
- Database migrations & Redis queue caching layer

## Phase 3 — Authentication & Admin Management
- Admin authentication via `.env` seed admin credentials
- Admin email validation & password setup / Google OAuth & Passkey integration
- Admin management interface (add secondary admins with Name, Email, Phone)

## Phase 4 — Student Group Management & File Import
- Parser module for PDF, Excel (.xlsx/.xls), CSV, and Google Docs import
- Group allocation engine (organizing students into Group 1, 2, 3...)
- Queue control panel ("Next Group" trigger action)

## Phase 5 — Real-time Queue, Estimation Engine & PWA
- Dynamic queue estimation engine (calculating arrival/interview window based on slot duration & average time spent)
- PWA manifest, service worker setup, push notifications for next group calls
- Student "I'm coming" presence toggle feature

## Phase 6 — Interactive Zoomable Calendar UI
- Top Bar: Brand header ("Gumi App"), search bar, Current Group banner (prominent), Next Group preview
- 3-tier Calendar Component:
  - Month view (1st – 30th/31st)
  - Date zoom view (24-hour timeline)
  - Hour zoom view (minute slots with group avatars & status badges)

## Phase 7 — E2E Testing, Optimization & Verification
- Verify strictly <300 lines per file constraint across all modules
- E2E test coverage for Admin upload, queue navigation, and student notifications
- Code formatting & quality validation (`pnpm run check-all`)
