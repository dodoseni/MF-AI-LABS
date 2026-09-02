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

## 2026-09-02 — MIKK-25: Minimal LevelUp backend skeleton (Express + /api/health)

- Component: backend
- Issue/ref: MIKK-25
- What was done:
  - Rebuilt `backend/` from scratch as a clean, deployable Express skeleton (JavaScript, Node >= 20, npm) per the 2026-09-02 reset decision.
  - Layout: `src/app.js` (Express app factory: `cors()`, `express.json()`, routes, 404 handler, centralized error handler), `src/server.js` (HTTP bootstrap), `src/routes/health.js` (`GET /api/health` → `{ "status": "ok" }`).
  - `package.json` with `start` (`node src/server.js`), `dev` (`node --watch src/server.js`), `test` (`jest --runInBand`), `engines.node: ">=20"`.
  - Server reads `process.env.PORT`, falls back to `4000` locally, binds `0.0.0.0` (required for Azure App Service Linux containers).
  - Added Jest + Supertest test (`tests/health.test.js`) asserting `GET /api/health` returns HTTP 200 with `{ "status": "ok" }`.
  - Added `backend/README.md` (install, local startup, test instructions, required Node version, Azure App Service deployment notes) and `backend/.gitignore` (`node_modules/`, `.env*`, `coverage/`).
  - Updated root `README.md`: backend row in the architecture table and the "Getting started" section now reflect the minimal skeleton instead of "not built yet".
  - Verified: `npm install`, `npm test` (1/1 passing), `npm start` (manually curled `/api/health` → 200 `{"status":"ok"}`; unknown route → 404).
- Decision/notes:
  - Deliberately excludes Azure SQL, authentication, AI/Foundry integration, and product endpoints per the issue scope — this is foundation only, to avoid repeating the disconnected-fragments problem from the 2026-09-02 reset.
  - `app.js`/`server.js` split (app factory vs. listener) so tests can import the Express app directly without binding a port.
  - CORS is currently unrestricted (`cors()` with defaults); flagged in `backend/README.md` to restrict allowed origins before any shared/production deployment.
- Open questions / risks:
  - No CI/CD pipeline configured yet for Azure App Service; deployment is manual (Oryx build via `npm install` + `npm start` once the App Service Node stack is set to >= 20).
  - Follow-up work (Azure SQL wiring, auth, AI integration, real product endpoints) should be tracked as separate issues against this foundation, coordinating with Data Engineer (schema/contract) and AI Engineer (auth/AI endpoints) before adding routes.

## 2026-09-02 — MIKK-26: Verify MIKK-25 backend skeleton merge into develop

- Component: backend
- Issue/ref: MIKK-26 (depends on MIKK-25)
- What was done:
  - Task was to merge `agent/full-stack-developer/9705327526e5` (MIKK-25 backend skeleton) into `develop`. On fetching, that merge was already present on `origin/develop` (PR #4, merged by a human, commit `3b5bda9`, followed by a README cleanup commit `5d4e6c6`), so no new merge commit or push was needed.
  - Verified `origin/agent/full-stack-developer/9705327526e5` is a full ancestor of `origin/develop` (`git merge-base --is-ancestor` confirms) and that all MIKK-25 deliverables are present on `develop`: `backend/package.json`, `backend/package-lock.json`, `backend/src/app.js`, `backend/src/server.js`, `backend/src/routes/health.js`, `backend/tests/health.test.js`, `backend/README.md`, and the MIKK-25 `docs/CHANGELOG.md` entry.
  - Ran `npm ci` + `npm test` against `backend/` on `origin/develop`: 1/1 test passing (`GET /api/health` → 200 `{"status":"ok"}`).
  - Left the source branch `agent/full-stack-developer/9705327526e5` in place (not deleted), per instructions; made no code changes.
- Decision/notes:
  - No new commit/SHA was produced by this task; `develop` remains at `5d4e6c6` (already on `origin/develop` prior to this run).
- Open questions / risks:
  - None — merge and tests confirmed green on `develop` as-is.

## 2026-09-02 — MIKK-28: Redesign Career Path around Level 1–4 (replace consulting titles)

- Component: frontend
- Issue/ref: MIKK-28
- What was done:
  - Replaced the old career ladder (Consultant → Senior Consultant → Principal Consultant → Enterprise Architect) with **Level 1–4** across the app: `data/mock.ts` (`careerPath`, `currentUser.level`/`nextLevel`, `dashboardStats`), `types/index.ts` (`CareerLevel` gained `requirementMode: 'all' | 'choose' | 'holistic'`, `requirementNote`, `chooseAtLeast`, `focusAreas`; dropped `role`/`yearsExperience`), `CareerPath.tsx`, `Dashboard.tsx`, `AiAssistant.tsx` canned replies, and `translations.ts` (EN/NO).
  - New certification catalog (`data/mock.ts`) matching the reference roadmap image supplied on the issue: Level 1 = hold all 4 (AZ-104, SC-300, Terraform Associate, Sopra Steria Navigator Foundation); Level 2 = choose ≥2 of 13 (AI-103, AI-200, AZ-800, AZ-700, SC-401, SC-200, SC-500, CKS, CKA, Terraform Professional, GH-500, GH-200, GH-300); Level 3 = choose ≥2 of 6 (AZ-305, AZ-400, SC-100, AB-100, MS-102, SC-730); Level 4 = no certification list, qualitative `focusAreas` (business impact, architecture leadership, innovation, CAF experience, Business Owner approval). Mock progress: Level 1 & 2 completed, Level 3 current (AZ-305 in progress 62%, 0/2 chosen), Level 4 upcoming.
  - `CareerPath.tsx` is now interactive: a new shared `LevelRoadmap` component (`components/ui.tsx`) renders the 4 levels as clickable chips with status icons (✓ completed / clock = current / circle = upcoming) connected by arrows, highlighting the real current level. Clicking a chip swaps the main detail panel (`LevelDetail`) to show that level's requirement rule (hold-all vs. choose-at-least-N vs. holistic) and its certification checklist (or focus-area list for Level 4). The sidebar (next-level readiness, missing requirements, fast summary) always reflects the user's **actual** current level regardless of which level is selected for viewing.
  - `Dashboard.tsx`: hero card now derives "current → next" level generically (`careerPath.find(l => l.status === 'current')`) instead of a hardcoded id/title; added a new "Your career roadmap" card reusing `LevelRoadmap` (read-only, links to `/career`); the "Certification progress" card and top-row "Level certifications" stat are now computed from the certification catalog instead of hardcoded magic numbers.
  - Updated remaining "Principal/Senior Consultant" copy for consistency: `AiAssistant.tsx` suggestion chips/canned replies/context blurb, and `competencies.summary` (EN/NO) now reference Level 3/4 instead of consulting titles.
  - Added CSS for `.level-roadmap` / `.level-chip` (status-aware colors, selected state) and `.level-detail`/`.level-req-head` note row (`components/app.css`).
- Decision/notes:
  - Reference screenshot attached to the issue used `AZ-802` for one Level 2 item; the issue's written text says `AZ-800` (Windows Server Hybrid Administrator Associate) — implemented per the written issue text since it is the authoritative instruction. Flagging in case Product Owner meant AZ-802 specifically.
  - Kept `currentUser.role` as a free-text job title (`Cloud Solutions Consultant`) distinct from `currentUser.level` (`Level 3`) — real job titles and the new Level 1–4 scale are orthogonal now; only the level scale was in scope for this issue.
  - Certifications not tied to any level (`AZ-900`, `AZ-204`, `AZ-500`, `DP-203`, `AI-102`) were kept in the catalog as historical/optional-specialisation entries (`requiredFor: []` or `Specialisation: ...`) rather than deleted, so completed-certification history on Certifications/Profile pages isn't lost.
  - Added 3 new certification categories (`Infrastructure`, `Collaboration`, `Internal`) to `Certifications.tsx`'s category filter to cover Terraform/Kubernetes, GitHub, and the internal Navigator cert.
  - `requirementMode`/`chooseAtLeast`/`requirementNote`/`focusAreas` are hand-authored per level in mock data (not derived from the certifications array) — consistent with the existing mock-data-only pattern in this codebase (no backend wiring yet, per MIKK-3/MIKK-14 decisions).
  - Verified with `tsc -b` + `vite build` (clean) and `oxlint` (only pre-existing warnings, no new ones); visually verified Dashboard, Career Path (Level 1/3/4 selected), Certifications and Profile pages via a local Playwright screenshot pass.
- Open questions / risks:
  - No automated tests exist for this frontend yet (repo-wide, pre-existing gap) — recommend Test-Agent add coverage for the new level-selection interaction on Career Path when a test suite is introduced.
  - `AZ-800` vs `AZ-802` discrepancy above should be confirmed with Product Owner if the reference image is meant to be authoritative over the issue text.

## 2026-09-02 — MIKK-29: LevelUp backend API contracts with mock data (read-only, `backend/`)

- Component: backend
- Issue/ref: MIKK-29
- What was done:
  - Extended `backend/` with five new read-only endpoints, all under `/api`: `GET /profile`, `GET /certifications`, `GET /competencies`, `GET /career-levels`, `GET /learning-plan`. `GET /api/health` is unchanged.
  - Introduced a layered architecture per the issue spec: `src/routes/` (path → controller, no logic) → `src/controllers/` (req/res, calls a service, wraps errors via `next(err)`) → `src/services/` (business logic, currently pass-through) → `src/repositories/` (the only layer that knows the data is mocked; every method is `async`/`Promise`-based on purpose) → `src/data/` (plain mock datasets).
  - Response envelope convention: list endpoints return `{ "data": [...] }`, single-resource endpoints return `{ "data": {...} }` (`/api/profile` and the `/api/learning-plan` bundle object). `/api/health` keeps its pre-existing bare `{ "status": "ok" }` shape (contract must not change).
  - Mock data is a direct, field-for-field port of `levelup-frontend/src/data/mock.ts` + `levelup-frontend/src/types/index.ts` (`currentUser`, `certifications`, `competencyAreas`, `careerPath`, `developmentGoals`/`studyPlan`/`weeklyStudyPlan`/`calendarEvents`) — same ids, statuses, categories, progress values, and relationships (e.g. certification `requiredFor` ↔ career-level `requirements`, career-level array order = progression order Consultant → Senior → Principal → Enterprise Architect). No new domain model was invented. The frontend file was read for reference only — it is not imported at runtime, keeping `backend/` independently deployable.
  - `GET /api/learning-plan` returns one combined object (`{ goals, tasks, weeklyPlan, calendar }`) instead of four separate endpoints, since the frontend Learning Plan page consumes all four together as one page-level resource.
  - `GET /api/profile` adds an `id` (`amalie-berg`) and a derived `email` field (not present in the frontend mock) to give the resource a stable key and a realistic profile shape for future auth/DB wiring; every other field matches `currentUser` from the frontend mock exactly.
  - Added Jest + Supertest coverage: one test file per endpoint (`tests/profile.test.js`, `certifications.test.js`, `competencies.test.js`, `careerLevels.test.js`, `learningPlan.test.js`) plus `tests/notFound.test.js` for the 404 path, each asserting HTTP status and basic response shape. `tests/health.test.js` (pre-existing) untouched. `npm ci && npm test` → 7/7 suites, 7/7 tests passing.
  - Updated `backend/README.md`: full endpoint table with description + response shape, local base URL, explicit "data is temporary mock data" + "repository layer is intended to be replaced by Azure SQL later" notes, and an updated project-structure tree. Updated root `README.md` (repository layout + architecture table + getting-started) to reflect the new endpoints instead of "`/api/health` only".
- Decision/notes:
  - Repository methods are `async`/return `Promise`s even though the current implementation is synchronous in-memory data — this is deliberate so a future Azure SQL repository can be swapped in with the exact same method signatures (`findAll()`, `findCurrentProfile()`, `findGoals()`, etc.) and zero changes to services/controllers/routes.
  - `learning-plan` is intentionally a single combined resource rather than four (`/goals`, `/study-tasks`, `/weekly-plan`, `/calendar`) to match how the frontend actually consumes the data (one page, one fetch) — flag for Data Engineer/AI Engineer if a future consumer needs these split.
  - Certification `progress`/`earnedDate` are `null` when not applicable (e.g. a `missing` cert has no `progress`) rather than omitted, so the frontend/consumers can rely on the fields always being present.
  - Did not add a shared response-envelope helper/module — each controller writes `{ data: ... }` explicitly. Small enough surface for now; worth extracting into a shared `sendSuccess()` helper if more endpoints are added.
  - No routing/controller/service/repository file exceeds ~20-40 lines; kept deliberately thin per the issue's "route/controller layer must not directly contain large mock datasets" requirement.
  - Scope respected: no mssql/DB dependency added, no auth, no AI, no POST/PUT/PATCH/DELETE, `levelup-frontend/` untouched, GitHub Actions deploy workflow (`.github/workflows/levelup-api-dev.yml`) untouched.
- Open questions / risks:
  - `/api/profile`'s `id`/`email` fields are additions beyond the frontend's `currentUser` mock — Data Engineer should confirm these align with (or should be renamed to match) the eventual Azure SQL `users` table's key/contact columns before the frontend is wired to real auth.
  - `career-levels` response order relies on array order, not an explicit `order`/`sequence` field — fine for a single hardcoded career track, but will need an explicit ordering column if multiple job-family tracks are introduced (see the earlier Data Engineer note on `job_family_level` in the MIKK-7 entry above, if that schema is revived).
  - No pagination/filtering on any list endpoint (not required by the current frontend or this issue) — flag if certifications/competencies lists grow large enough to need it.

## 2026-09-02 — MIKK-30: QA validation of MIKK-29 backend API contracts

- Component: QA
- Issue/ref: MIKK-30 (validates MIKK-29, branch `agent/back-end-developer/9e1011cc4ed7`, commit `d2eb3c0`)
- What was done:
  - Independently validated all 6 endpoints (`/api/health` + the 5 new mock-data-backed contracts) both via `npm ci && npm test` (backend/, 7/7 suites, 7/7 tests passing) and by starting the server locally and manually curling every endpoint plus an unknown route.
  - Confirmed response envelopes match spec: list endpoints (`certifications`, `competencies`, `career-levels`) → `{ data: [...] }`; single-resource endpoints (`profile`, `learning-plan`) → `{ data: {...} }` with `learning-plan.data` containing `goals`, `tasks`, `weeklyPlan`, `calendar`; `health` unchanged bare `{ status: 'ok' }`; unknown routes → 404 `{ error: 'Not Found' }`.
  - Confirmed architecture: clean routes → controllers → services → repositories → data layering, no mock data embedded in routes/controllers, no `levelup-frontend` import at runtime, repository methods are `async`/`Promise`-based (`findAll`, `findCurrentProfile`, `findGoals`/`findTasks`/`findWeeklyPlan`/`findCalendarEvents`) ready for an Azure SQL swap, and no DB/auth/AI dependency added (`package.json`/`package-lock.json` diff vs the MIKK-25 skeleton is empty — no new deps at all).
  - Compared backend mock data field-for-field against `levelup-frontend/src/data/mock.ts` + `src/types/index.ts`: no missing fields, no renamed fields, no relationship mismatches (`certification.requiredFor` ↔ `career-level.requirements`, career-level array order all verified). Only two additive/typing notes: (1) `/api/profile` adds `id`/`email` beyond `currentUser` (matches the documented, expected addition); (2) `Certification.progress`/`earnedDate` are always present as explicit `null` rather than omitted like the frontend's optional (`?`) fields — functionally harmless for typical truthy/`??` checks, but strict `=== undefined` checks or a generated TS client would need `| null` added to those types. Flagged as non-blocking.
  - Confirmed scope discipline: diffing the branch against its actual merge-base (`9f20cd8`) — not against current `develop` tip — shows this branch touched **only** files under `backend/` + `README.md`/`docs/CHANGELOG.md`; zero changes to `levelup-frontend/`, `.github/workflows/`, Azure infra, auth, or AI/Foundry integration. (A raw `git diff --stat` against `origin/develop` HEAD misleadingly shows frontend files as "changed" — that's because `develop` moved forward independently with the unrelated MIKK-28 Career Path redesign after this branch forked; a `git merge-tree` dry run confirms no conflicts merging into `develop`.)
  - Reviewed the two flagged "future considerations" (`profile` id/email addition; career-level order-only ranking) — both correctly documented in the MIKK-29 CHANGELOG entry as deliberate, low-risk, and deferred; neither blocks this merge.
- Decision/notes: **PASS WITH NOTES** — recommend **MERGE**. Full endpoint validation table, test/manual-run results, and detailed findings posted as a comment on MIKK-30.
- Open questions / risks:
  - Non-blocking: `Certification.progress`/`earnedDate` should be typed `| null` (not just optional) on the frontend/shared-types side once any code there does strict-equality checks against `undefined`.
  - Carrying forward from MIKK-29: Data Engineer should confirm `/api/profile`'s `id`/`email` against the eventual Azure SQL `users` table before auth wiring; `career-levels` will need an explicit order/sequence field if multiple job-family tracks are introduced.

## 2026-09-02 — MIKK-31: Align backend API contracts (MIKK-29) with current develop frontend model (Level 1-4, MIKK-28)

- Component: backend
- Issue/ref: MIKK-31 (rebases MIKK-29 on top of MIKK-28, branch `agent/back-end-developer/9e1011cc4ed7` @ `d2eb3c0` → this branch)
- Base/reference: `origin/develop` @ `18d5f6e` (`Merge pull request #6` — MIKK-28 Career Path redesign, on top of the MIKK-29 merge-base `9f20cd8`).
- What was done:
  - Since MIKK-29 was built, MIKK-28 replaced the frontend's career-progression titles (Consultant / Senior Consultant / Principal Consultant / Enterprise Architect) with a generic **Level 1–4** roadmap and reshaped `CareerLevel` (`requirementMode`, `requirementNote`, `chooseAtLeast`, `focusAreas`) and `Certification.requiredFor` in `levelup-frontend/src/data/mock.ts` + `src/types/index.ts`. This issue re-aligns the backend mock data with that current frontend source of truth, without touching `levelup-frontend/` itself.
  - `backend/src/data/careerLevels.js`: replaced the 4-entry Consultant→Enterprise Architect roadmap (which carried `role`/`yearsExperience`) with the current `Level 1`..`Level 4` roadmap, field-for-field ported from `careerPath` in the frontend mock: `id` (`level-1`..`level-4`), `name`, `tagline`, `description`, `color`, `progress`, `status`, `requirementMode` (`'all'` for Level 1, `'choose'` + `chooseAtLeast: 2` for Level 2/3, `'holistic'` for Level 4), `requirementNote`, `requirements` (empty array for Level 4), and `focusAreas` (Level 4 only). `role`/`yearsExperience` were dropped — the frontend model no longer has them.
  - `backend/src/data/certifications.js`: updated every certification's `requiredFor` from the old titles (`'Consultant'`, `'Senior Consultant'`, `'Principal Consultant'`) to the current Level values (`'Level 1'`, `'Level 2'`, `'Level 3'`) and added the certifications the frontend catalog gained (Level 2 specialisation track: `ai-103`, `az-800`, `ai-200`, `az-700`, `sc-401`, `sc-200`, `sc-500`, `cks`, `cka`, `terraform-professional`, `gh-500`, `gh-200`, `gh-300`; Level 1: `sc-300`, `terraform-associate`, `navigator-foundation`; Level 3: `sc-100`, `ab-100`, `ms-102`, `sc-730`) — 28 certifications total (up from 10). `az-204` moved from `requiredFor: ['Senior Consultant']` to `requiredFor: []` (pre-Level-1/historical, matching the frontend). Kept the existing backend convention of explicit `null` for `progress`/`earnedDate` when absent (documented in MIKK-29/MIKK-30) rather than switching to the frontend's optional-field style.
  - `backend/src/data/profile.js`: `level`/`nextLevel` changed from `'Senior Consultant'`/`'Principal Consultant'` to `'Level 3'`/`'Level 4'` (matches `currentUser.level`/`currentUser.nextLevel` on develop); `role` changed to `'Cloud Solutions Consultant'` (matches `currentUser.role`) and is now intentionally a different value from `level` (previously they were identical). `id`/`email` backend-only additions are unchanged, per the MIKK-29/MIKK-30 decision.
  - `backend/src/data/competencies.js` and `backend/src/data/learningPlan.js` were compared field-for-field against the current `competencyAreas`/`developmentGoals`+`studyPlan`+`weeklyStudyPlan`+`calendarEvents` on develop — already an exact match, no changes needed.
  - No changes to `routes/`, `controllers/`, `services/`, or `repositories/` — all five layers are simple pass-throughs with no career-level/consulting-title logic, so only the `data/` layer needed updating; the layered architecture from MIKK-29 is fully preserved.
  - Updated tests: `tests/careerLevels.test.js` now asserts the 4-level `level-1`..`level-4` order/names, `requirementMode` values (`'all'`/`'choose'`/`'holistic'`), and dedicated checks for Level 2/3 `chooseAtLeast` and Level 4's `focusAreas`+empty `requirements`. `tests/certifications.test.js` adds an assertion that `requiredFor` values are `"Level 1"`.."Level 3"` (not the old consulting titles). `tests/profile.test.js` asserts `level`/`nextLevel` match `/^Level [1-4]$/` and that `role !== level`. `tests/competencies.test.js`/`tests/learningPlan.test.js`/`tests/health.test.js`/`tests/notFound.test.js` unchanged.
  - Updated `backend/README.md`'s endpoint table + added a "Career levels" note explaining the Level 1-4 roadmap, `requirementMode` semantics, and how `certifications[].requiredFor` links to it.
  - `docs/CHANGELOG.md` conflict resolution: this branch (forked from `9f20cd8`, before MIKK-28) and `origin/develop` (which merged MIKK-28 directly, without ever merging the MIKK-29/MIKK-30 backend entries) had each appended different new entries after the same point in the file, which `git merge-tree` confirmed would conflict on a real merge. Resolved by splicing in `origin/develop`'s MIKK-28 entry (frontend, verbatim) ahead of the existing MIKK-29/MIKK-30 entries already on this branch, then appending this MIKK-31 entry — so the file now carries all four entries (MIKK-28, MIKK-29, MIKK-30, MIKK-31) in chronological order and a real merge into `develop` should no longer conflict on this file.
  - Ran `cd backend && npm ci && npm test`: **7/7 suites, 10/10 tests passing** (10, up from 7, due to the 3 new career-levels/certifications/profile assertions above).
- Decision/notes:
  - `certifications[].requiredFor` for Level 4 stays empty everywhere (`[]`) since Level 4 is `requirementMode: 'holistic'` with no fixed certification list — matches the frontend, where no certification references `'Level 4'`.
  - Did not rename or restructure any endpoint, route, or response envelope — this was purely a mock-data/contract-value alignment, not an architecture change. `GET /api/health`, `/api/profile`, `/api/certifications`, `/api/competencies`, `/api/career-levels`, `/api/learning-plan` are all unchanged as endpoints.
  - Branch was rebased/updated on top of `agent/back-end-developer/9e1011cc4ed7` (`d2eb3c0`) rather than starting fresh, per the issue instructions — MIKK-29's architecture and file layout are fully preserved, only `src/data/*.js` + tests + docs changed.
  - Did not merge this branch into `develop` per explicit instruction; left for a follow-up merge/QA step (mirroring the MIKK-29 → MIKK-30 pattern).
- Open questions / risks:
  - Carrying forward from MIKK-29/MIKK-30 (still open): Data Engineer should confirm `/api/profile`'s `id`/`email` against the eventual Azure SQL `users` table before auth wiring; `Certification.progress`/`earnedDate` should be typed `| null` (not just optional) if a shared TS client is generated later.
  - `career-levels` order still relies on array order rather than an explicit `order`/`sequence` field (same caveat as MIKK-29) — still fine for a single 4-level track, revisit if multiple tracks are introduced.
  - This branch should go through the same QA validation step MIKK-29 got (MIKK-30) before merging into `develop`, since `develop` has moved forward (MIKK-28) since this branch's last QA pass.

## 2026-09-02 — MIKK-33: QA re-validation of MIKK-31 backend API contracts (Level 1-4 alignment)

- Component: QA
- Issue/ref: MIKK-33 (validates MIKK-31, branch `agent/back-end-developer/9e1011cc4ed7`, commit `fe1ad29`)
- What was done:
  - Ran `cd backend && npm ci && npm test`: **7/7 suites, 10/10 tests passing**.
  - Started the server locally (`node src/server.js`, custom `PORT`) and manually curled all 6 endpoints: `GET /api/health` (200, `{status:'ok'}`), `/api/profile` (200, `{data:{...}}`), `/api/certifications` (200, `{data:[...]}`, 28 items), `/api/competencies` (200, `{data:[...]}`, 5 items), `/api/career-levels` (200, `{data:[...]}`, 4 items), `/api/learning-plan` (200, `{data:{goals,tasks,weeklyPlan,calendar}}`); also confirmed an unknown route returns 404 `{error:'Not Found'}`.
  - Field-by-field diffed `backend/src/data/*.js` against `origin/develop`'s current `levelup-frontend/src/data/mock.ts` + `src/types/index.ts` (@ `18d5f6e`): `careerLevels.js` is an exact match of `careerPath` (Level 1 `requirementMode:'all'`; Level 2/3 `'choose'` + `chooseAtLeast:2`; Level 4 `'holistic'` with `focusAreas`, empty `requirements`, no cert references it via `requiredFor`); `certifications.js` (28 entries) matches `certifications` exactly aside from the pre-existing, documented convention of explicit `progress:null`/`earnedDate:null` instead of omitted optional fields; `profile.js` matches `currentUser` (`level:'Level 3'`, `nextLevel:'Level 4'`, plus the pre-existing `id`/`email` additions); `competencies.js` and `learningPlan.js` are byte-for-byte matches of `competencyAreas`/`developmentGoals`+`studyPlan`+`weeklyStudyPlan`+`calendarEvents`. No trace of the old Consultant/Senior/Principal/Enterprise Architect model remains anywhere in `backend/`.
  - Confirmed layered architecture intact: routes → controllers → services → repositories → data, verified for all 5 mock-data endpoints; no mock data embedded above the `data/` layer.
  - Confirmed no DB (`mssql`/`sequelize`/etc.), auth (`passport`/`jsonwebtoken`/etc.), or AI (`openai`/Cognitive Search SDK/etc.) dependencies — `backend/package.json` only lists `express`+`cors` (deps) and `jest`+`supertest` (devDeps). No changes to `levelup-frontend/` or `.github/workflows/` in this branch's diff vs. its merge-base.
  - Merge-conflict assessment: ran `git merge-tree` and a real `git merge --no-commit --no-ff origin/develop` dry run (aborted after inspection). Only `docs/CHANGELOG.md` conflicts. Root cause confirmed non-substantive: this branch's `docs/CHANGELOG.md` already contains `origin/develop`'s full MIKK-28 entry spliced in verbatim (both "Decision/notes" and both "Open questions/risks" bullets, including the `AZ-800` vs `AZ-802` note) *plus* the MIKK-29/30/31 entries appended after it — i.e. this branch's file is a strict superset of `origin/develop`'s content for this file. Git's line-diff/no-trailing-newline handling produces conflict markers because the last line of `origin/develop`'s insertion (`AZ-800` vs `AZ-802` bullet) textually matches a line that also appears earlier in this branch's insertion, but no content would be lost or overwritten by resolving in favor of this branch's version. **Non-blocking.**
- Decision/notes: **PASS WITH NOTES** — recommend **MERGE**. `docs/CHANGELOG.md` merge conflict should be resolved by keeping this branch's version of the file (superset of `develop`'s MIKK-28 entry, plus MIKK-29/30/31) — no manual content reconciliation needed. Full validation table posted as a comment on MIKK-33.
- Open questions / risks:
  - Carrying forward (still open, unchanged since MIKK-29/30/31): Data Engineer should confirm `/api/profile`'s `id`/`email` against the eventual Azure SQL `users` table before auth wiring; `Certification.progress`/`earnedDate` should be typed `| null` if a shared TS client is generated later; `career-levels` order still relies on array order, not an explicit `order`/`sequence` field.