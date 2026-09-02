# CHANGELOG

Shared, version-controlled record of tasks completed during LevelUp platform development. Entries are appended in chronological order.

## 2026-09-01 — MIKK-7: Azure SQL data model (certifications, competency, career levels)

- Component: data
- Issue/ref: MIKK-7
- What was done:
  - Added `levelup-db/` with an Azure SQL (T-SQL) schema covering users, certifications (with the certification matrix), the five competency areas, the Job Family framework, career levels, and user progression records (certifications, competency self-assessments, career position, development goals, study-plan items).
  - Seed script (`seed.sql`) for the reference/catalog data aligned to `levelup-frontend/src/data/mock.ts`; convenience views (`views.sql`) for the three primary MVP reads (certification overview, competency gap, career path).
- Decision/notes:
  - Two-tier model: non-sensitive reference/catalog tables (job-family levels, competency areas, certification catalog, requirements) vs. user-owned tables that carry `user_id + tenant_id` and soft-delete (`deleted_at`) so RLS / tenant isolation can be enforced without a future migration.
  - Natural human-readable keys (`az-305`, `Sales`, `principal`) matching frontend mock ids for catalog tables; `BIGINT IDENTITY` only where no natural key exists. `job_family_level` is keyed on `(family_code, level_code)` so additional tracks are additive.
  - `user_competency.current/target/previous` + `review_period_key` supports trend visualization and time-series history; schema is MVP-scoped, no audit triggers or cross-tenant sharding yet.
- Open questions / risks:
  - `user_certification` is unique per `(user_id, certification_id)` — will block holding the same cert twice (renewals); relax if renewals are needed.
  - `source_document` is raw free text for MVP; a structured document/link table may be needed once ingestion from PDF/SharePoint/Learn is productized.
  - RLS policies and the app principal model are not yet implemented (modelled only). Coordinate with the backend before enabling RLS.

## 2026-09-01 — MIKK-6: Backend API skeleton (Azure App Service)

- Component: backend
- Issue/ref: MIKK-6
- What was done:
  - Scaffolded Express.js backend API at `backend/` with structured layout (routes, middleware, services, config)
  - Defined `/api` route prefix convention with `GET /api/health` health endpoint
  - Stubbed Azure SQL Database connectivity via `mssql` driver (`services/azureSql.js`)
  - Stubbed AI service connectivity (`services/aiService.js`)
  - Added Dockerfile for Azure App Service (node:20-alpine, port 4000)
  - Set up ESLint + Jest with supertest; lint and tests pass
- Decision/notes: Express.js chosen to follow project-repo convention from existing demo. Separate `backend/` directory placed at repo root. Config via environment variables with sensible defaults.
- Open questions / risks: Azure App Service deployment pipeline (CI/CD) not yet configured; Azure SQL and AI service endpoints remain stubbed pending actual Azure resource provisioning.

## 2026-09-01 — MIKK-8: LevelUp AI Assistant (Azure OpenAI + RAG + Entra ID)

- Component: AI, backend, frontend, infra
- Issue/ref: MIKK-8
- What was done:
  - Built FastAPI backend (`levelup/backend/app.py`) with Azure OpenAI chat completion and Azure AI Search RAG pipeline
  - Implemented dual persona support (consultant vs manager) with tailored system prompts
  - Created consultant-facing and manager-facing chat UI (`levelup/frontend/index.html`)
  - Added Microsoft Entra ID app registration for SSO (`levelup/infra/terraform/main.tf`)
  - Created Terraform for Azure AI Search, Blob Storage, and OpenAI resource provisioning
  - Built blob-seed script for document chunking and search index population
  - Added Docker Compose for local development and K8s manifests for AKS deployment
- Decision/notes:
  - Chose Python FastAPI over Node.js for native Azure SDK support (azure-identity, azure-search-documents)
  - RAG uses Azure AI Search vector + keyword hybrid search with 1000-char overlapping chunks
  - Entra ID integration uses MSAL implicit grant flow for SPA + backend token exchange
  - Entra ID app registration configured with Microsoft Graph User.Read scope for SSO
  - DefaultAzureCredential used for AI Search auth (supports managed identity in production)
  - Document seeding is a separate CLI tool, not embedded in the app runtime
- Open questions / risks:
  - Azure OpenAI model deployment (gpt-4 / gpt-4o) must be created manually in the Azure portal before use
  - Entra ID Conditional Access policies may block token issuance
  - No CI/CD pipeline yet; deployment is manual via Docker Compose or kubectl
  - Document ingestion currently supports .txt and .md only; PDF parsing would require additional tooling

## 2026-09-01 — MIKK-3: LevelUP frontend (enterprise React UI)

- Component: frontend
- Issue/ref: MIKK-3
- What was done:
  - Built React 19 + TypeScript + Vite app (`levelup-frontend/`) with Dashboard, Certifications, Competency Development, Career Path, Learning Plan, and AI Assistant pages
  - Mock data in `src/data/mock.ts` aligned with the `levelup-db/` seed; typed entities in `src/types/index.ts`
  - Reusable UI components (Icon, Sidebar, Topbar, ui.tsx) and a cohesive design system in `app.css`
- Decision/notes:
  - Frontend uses mock data until the backend API is available; mock ids match the data model's natural keys for a clean later swap
  - Design follows Microsoft Learn / Azure Portal quality bar: clean, professional, responsive
- Open questions / risks: no backend wiring yet (deliberate — backend is stubbed)

## 2026-09-01 — Repository consolidation: LevelUp work moved to MF-AI-LABS

- Component: infra
- What was done:
  - Consolidated all agent work (`backend/`, `levelup/`, `levelup-db/`, `levelup-frontend/`) into the shared `MF-AI-LABS` repository as the initial `main` commit.
  - Added top-level `README.md` and consolidated `docs/CHANGELOG.md`.
- Notes:
  - The previous target repo (`multica-infra`) was the wrong home; MF-AI-LABS is now the shared repo for LevelUp.
  - Initial push may require GitHub write credentials (PAT/gh/SSH) on the runtime.

## 2026-09-01 — Phase 2 plan: from mock/hardcoded data to working functionality

- Component: planning
- Status: PLANNED (backlog) — not yet executed
- Context:
  - Phase 1 delivered a full UI (React + TS, mock data), an Express backend with only `/api/health`, a ready-but-unapplied Azure SQL data model, and an AI assistant codebase that still needs Azure resources.
  - Everything currently runs on hardcoded mock data (`levelup-frontend/src/data/mock.ts`); no endpoint returns real data yet.
- Phase 2 issues (created in backlog, assigned, awaiting subscription access + scope decision):
  - MIKK-10 P2-01 Provision Azure resources (AI Engineer) — P1 — prerequisite for everything below.
  - MIKK-11 P2-02 Deploy data model to Azure SQL (Data Engineer) — P1 — blocked on MIKK-10.
  - MIKK-12 P2-03 Entra ID SSO authentication (Full-Stack Developer) — P1 — blocked on MIKK-10.
  - MIKK-13 P2-04 Backend API endpoints on real data (Full-Stack Developer) — P1 — blocked on MIKK-10/11.
  - MIKK-14 P2-05 Wire frontend to backend, remove mock data (Frontend Developer) — P1 — blocked on MIKK-13.
  - MIKK-15 P2-06 AI assistant with real Azure OpenAI + RAG + seeded docs (AI Engineer) — P2 — blocked on MIKK-10.
  - MIKK-16 P2-07 Manager overview on real data (Full-Stack Developer) — P2 — blocked on MIKK-13.
  - MIKK-17 P2-08 QA cycle for Phase 2 (Test-Agent) — P2 — after feature work lands on `develop`.
- Decisions / scope:
  - Priority split: P1 = foundation + data flow (auth → real API → UI wiring); P2 = AI grounding, manager view, QA.
  - Deploy target for all Phase 2 work: `develop` branch. `main` stays reserved for production.
  - Secrets (connection strings, API keys, client secrets) never committed; `.env.example` documents names only.
- Open questions / blockers (need product decision before MIKK-10 runs):
  - Who owns the Azure subscription / which Azure tenant & subscription ID should resources be provisioned in (Sopra Steria tenant vs dev subscription)?
  - Scope of the next demo: full vertical slice (auth → dashboard on real data) vs certifications-only slice without auth.

## 2026-09-02 — MIKK-21: Close out the frontend experience (Profile, i18n, interactive Learning Plan & Certifications)

- Component: frontend
- Issue/ref: MIKK-21
- What was done:
  - Added a lightweight, dependency-free i18n layer (`src/i18n/translations.ts` + `LanguageContext.tsx`) with English and Norwegian dictionaries, a `useLanguage()` hook, and `localStorage` persistence (`levelup.lang`). A language selector was added to the `Topbar` (visible on every page) and mirrored as a preference control on the new Profile page.
  - Translated all static UI chrome with the new `t()` helper: sidebar nav, topbar, page headers/subtitles, buttons, status badges, and card labels across Dashboard, Certifications, Competencies, Career Path, Learning Plan, AI Assistant and Profile.
  - Built the missing **Profile** page (`src/pages/Profile.tsx`, route `/profile`, linked from the sidebar avatar and the topbar account icon): identity card, current level + progress-to-next-level, completed certifications list, active learning plans with progress bars, competency overview, and the language preference control.
  - Made **Learning Plan** interactive per the spec: added a reusable `Calendar` component (`src/components/Calendar.tsx`) driven by a new `calendarEvents` mock dataset (study sessions, practice exams, certification exam date, milestones) with month navigation and a day-detail panel; added a "Weekly study plan" section from a new `weeklyStudyPlan` mock dataset (Mon/Wed/Fri/Sun cadence); converted goal milestones and study-plan tasks into `useState`-backed, clickable checklists so progress bars and percentages recompute live when a user checks something off.
  - Made **Certifications** functional instead of decorative: "Add certification" now opens a modal that appends a real certification to local state; "Start tracking" / "Mark completed" buttons transition a certification's status (missing/recommended → in-progress → completed) instead of being static labels; the category filter is now wired to actual filtering.
  - Added a `globe` icon and modal/calendar/weekly-plan CSS to `app.css`, keeping the existing design system (same tokens, card/button/badge patterns) rather than introducing new UI primitives.
- Decision/notes:
  - Scope decision on localization: full UI chrome (navigation, headers, buttons, statuses, empty states) is translated NO/EN. Mock *content* (certification names/descriptions, goal titles, AI reply text) is intentionally left in English for this pass — translating seed content would mean maintaining parallel mock datasets per language, which is a data/content decision better made once real content/CMS is in place.
  - Calendar and certification/goal state are local `useState` (no persistence) — consistent with the rest of the app, which is fully mock-data driven with no backend wiring yet (per MIKK-3 decision). Wiring this to the real API is covered by the existing Phase 2 plan (MIKK-14).
  - Did not touch the `Competencies` page's radar chart even though the issue's design guidance says to avoid radar charts/advanced analytics — that page and chart predate this issue (MIKK-3) and weren't in this issue's page list (Dashboard, Career Path, Certifications, Learning Plan, AI Coach, Profile). Flagging for Product Owner: worth a follow-up decision on whether to simplify Competencies to match the "avoid radar charts" guidance.
- Open questions / risks:
  - No automated tests added (repo has none for the frontend yet); verified via `tsc -b`, `vite build`, and `oxlint` (clean, pre-existing warnings only).
  - Certification "Add" modal and status toggles, and Learning Plan checklists, only persist in component state (lost on refresh) — expected for a mock-data MVP, but worth flagging before QA treats it as a bug.

## 2026-09-02 — Reset: remove unintegrated backend, AI service, and data model

- Component: planning, backend, AI, data
- Issue/ref: cancels MIKK-6, MIKK-7, MIKK-8, MIKK-17, MIKK-20, MIKK-23, MIKK-24 (Product Owner decision)
- What was done:
  - Deleted `backend/` (Express skeleton, health-check only), `levelup/` (Python FastAPI AI assistant with real Azure OpenAI + RAG + Entra ID), and `levelup-db/` (Azure SQL schema/seed/views) from the repository.
  - Cancelled the corresponding Multica issues (MIKK-6, MIKK-7, MIKK-8) plus the stalled/duplicated Phase 2 follow-ups (MIKK-17 QA, MIKK-20 deployment-readiness analysis, MIKK-23 AI chatbot). MIKK-22 (a duplicate of MIKK-23) had already been removed independently.
  - Updated `README.md` to drop repository-layout and getting-started sections for the removed components; architecture table now marked "target — not yet built" except frontend.
- Decision/notes:
  - Each of the three removed components was built independently, never integrated with each other or with `levelup-frontend`, and never deployed. The backend only exposed `/api/health`; the SQL schema was never applied to a database; the AI service was a disconnected Python app the Node backend never called. Marking this "done" work created a false signal of backend progress.
  - The documented "Phase 2 plan" (intended issues MIKK-10–MIKK-16) was never actually created as tracked issues, so there was no real backlog to inherit from — nothing of substance is lost by resetting.
  - Only `levelup-frontend/` (MIKK-3, MIKK-21) is considered shipped and is kept as-is.
  - The backend will be rebuilt from scratch as a new, single tracked effort (starting from a mock-data API foundation) rather than three disconnected fragments built by different agents in parallel.
- Open questions / risks:
  - The Azure SQL schema (`levelup-db/`) and the real RAG/Entra ID logic (`levelup/backend/app.py`) are gone from `develop`; both remain recoverable from git history (pre-reset commits) if the team wants to reuse any of that work as reference during the rebuild.