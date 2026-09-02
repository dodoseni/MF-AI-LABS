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
## 2026-09-02 — MIKK-32: Simplify Dashboard — remove goals/recommendations/competency clutter

- Component: frontend
- Issue/ref: MIKK-32
- What was done:
  - Slimmed `Dashboard.tsx` down to the components explicitly listed as "Keep" in the issue: header (welcome + intro text), the "Progress to Next Level" hero card, and the "Current Level" / "Level certifications" statistic cards.
  - Removed everything called out under "Remove": the "Recommended Next Actions" card (which surfaced Career Path / Study Plan / Certification recommendations), the "AI Recommendation" card and its "Open Assistant" entry point, the "Active Goals" and "Competencies" statistic cards, the "Competency Development" card (Sales/Delivery/Manage/Entrepreneurship/Develop breakdown + level dots + growth badges), and the "Upcoming Milestones" card (the dashboard's learning-plan section).
  - Dropped now-unused imports/data from `Dashboard.tsx` (`competencyAreas`, `recommendedActions`, `LevelDots`, `Badge`, `react-router-dom` `Link`, the `impactIcon` map) and changed the stats grid from `grid-4` to the existing `grid-2` utility class (2 cards instead of 4).
- Decision/notes:
  - Kept the "Certification progress" card (progress bar + X/Y completed, link to `/certifications`) and the "Your career roadmap" card (`LevelRoadmap`, added in MIKK-28) — neither was named in the issue's "Remove" list, and both are direct extensions of the explicitly-kept "Current Level"/"Certifications" hero content rather than the recommendation/goals/competency clutter the issue targets.
  - Scope was limited to the Dashboard page only. The standalone `Competencies` page, its nav entry, and the `competencyAreas` / `recommendedActions` mock data were left untouched — they're still used by `Profile.tsx` and `Competencies.tsx`, and the issue body is scoped entirely to "Dashboard" (no mention of removing the Competencies page or nav item itself).
  - No goals-specific UI existed outside the "Active Goals" stat card and learning-plan milestones (both removed); there is no separate "Goals" page in the app.
- Open questions / risks:
  - If the intent was also to delete the standalone `/competencies` page and nav link entirely (title says "Delete Competencies and goals"), that's a separate, larger change not covered here — flag to Product Owner if that's actually wanted, since it would also require touching `Sidebar.tsx`, `Profile.tsx`, routing, and translations.
  - Verified with `tsc -b` (clean), `vite build` (clean), `oxlint` (only pre-existing warnings), and a local Playwright screenshot of the rendered Dashboard.

## 2026-09-02 — MIKK-36: Remove Competency feature entirely from the frontend

- Component: frontend
- Issue/ref: MIKK-36 (the follow-up flagged as an open question on MIKK-32)
- What was done:
  - Deleted the standalone Competency Development page (`src/pages/Competencies.tsx`, including its hand-rolled inline-SVG radar chart) and its route/nav entry (`App.tsx` import + `pageTitleKeys['/competencies']` + `<Route path="/competencies">`; `Sidebar.tsx` `mainNav` entry).
  - Removed all competency-related data/types: `competencyAreas` mock array, the `dashboardStats` "Competencies" stat entry, the `CompetencyArea` / `CompetencyEntry` / `SelfAssessmentLevel` types (`src/types/index.ts`), and the now-dead `LevelDots` component (`components/ui.tsx`) plus its CSS — `LevelDots` had no remaining consumers once the Competencies page and Profile's competency section were removed.
  - Removed the competency-specific content that was inside otherwise-generic mock arrays rather than deleting the arrays themselves: the "Strengthen Sales competency to level 4" development goal (`g2`) and its associated calendar events (`e6`, `e9`, `e13` — the milestones that only existed to support that goal), and the "Sales competency needs attention" recommended-action entry (`r3`, which linked to the now-deleted `/competencies` route and was already unused/unrendered dead data).
  - Removed the "Competency overview" card, its `avgCompetency` stat card, and the `competencyAreas` import from `Profile.tsx` (stats grid dropped from `grid-4` to `grid-3`); removed all competency-gap wording/routing from `AiAssistant.tsx` (greeting text, suggestion chip, the `gap` canned reply + its keyword routing, capability list item, context blurb); removed the `.comp-card`/`.comp-row`/`.radar-wrap`/`.growth-badge` CSS blocks from `app.css`.
  - Removed the 11 EN + 11 NO `nav.competencies` / `title.competencies` / `competencies.*` / `profile.stats.avgCompetency` / `profile.competencyOverview` / `dashboard.competencyDevelopment` translation keys, and reworded the 4 generic subtitle/placeholder strings that mentioned "competencies" in passing (`dashboard.subtitle`, `learning.subtitle`, `assistant.subtitle`, `assistant.placeholder`) so no dangling reference to the removed feature remains, in both languages.
- Decision/notes:
  - `Dashboard.tsx` itself needed no code change: it renders `stats[0]`/`stats[1]` from `dashboardStats`, and those indices were already "Current level" / "Level certifications" (the Competencies entry was index 2, ahead of "Active goals") — so removing that array entry didn't shift the indices Dashboard depends on.
  - No charting library exists in `package.json` (the Competencies radar chart was pure inline SVG), so there was nothing to remove from dependencies.
  - Left the unused `comp` icon definition in `components/Icon.tsx`'s icon registry (a generic named-icon map entry, harmless to keep, not competency-specific by itself) and the unrelated generic use of the word "competency" in the Kubernetes certification description (`mock.ts`) — neither is part of the Competency feature.
- Open questions / risks:
  - None outstanding. Verified with `tsc -b` (clean), `vite build` (clean), `oxlint` (only the two pre-existing warnings unrelated to this change), and a local Playwright pass confirming no console/page errors and no remaining Competency UI on Dashboard, Profile, Career Path, Learning Plan and AI Assistant; `/competencies` now falls through to the existing wildcard route (renders Dashboard) since the route no longer exists.

## 2026-09-02 — MIKK-35: Connect LevelUp frontend to deployed backend API

- Component: frontend
- Issue/ref: MIKK-35
- What was done:
  - Added a typed API client layer under `levelup-frontend/src/api/`: `client.ts` (`apiGet<T>()` — fetch with a 10s timeout, unwraps the backend's `{ data: T }` envelope, throws a typed `ApiError` with a user-presentable message on network failure / timeout / non-2xx / bad JSON), `useApiResource.ts` (a small hook — `{ data, loading, error, retry }`, abort-on-unmount/retry, no react-query/swr dependency, matching this codebase's existing hand-rolled-hook convention), and one module per resource: `profile.ts`, `certifications.ts`, `careerLevels.ts`, `learningPlan.ts` (one combined `GET /api/learning-plan` covering goals/tasks/weeklyPlan/calendar). A `competencies.ts` module was written too but removed again while resolving this branch's merge conflict with MIKK-36 (see below) — see Decision/notes.
  - Added `ProfileContext.tsx` (`ProfileProvider` + `useProfile()`, wired in `main.tsx` above the router) so the profile — needed independently by the persistent `Sidebar`, `Dashboard`, and the `Profile` page — is fetched exactly once per app session instead of three times; confirmed via a Playwright network-request count against both the Vite dev server (StrictMode double/triple-invokes effects in dev, a React dev-only artifact) and the production `vite build` output (exactly 1 request).
  - Wired `Dashboard.tsx`, `Certifications.tsx`, `CareerPath.tsx`, `LearningPlan.tsx`, `Profile.tsx` and `Sidebar.tsx` to the real endpoints (`GET /api/profile|certifications|career-levels|learning-plan`), replacing their direct `src/data/mock.ts` imports. Every fetching page/component wraps its content in a new shared `<ApiState>` component (`src/components/ApiState.tsx`): a spinner while loading, a friendly message + "Retry" button on failure (network error, timeout, non-2xx), and the real content once loaded — the app cannot crash or blank-screen if the backend is unreachable (verified by aborting all `/api/*` requests in Playwright: shows the error banner, `Retry` recovers cleanly once requests are unblocked again). `Sidebar` (persistent chrome, not gated behind a full-page `ApiState`) degrades to placeholder text (`···` / "Loading...") instead.
  - Added `Profile` and `LearningPlanData` types to `src/types/index.ts` (the domain model had no `Profile` type yet; `LearningPlanData` mirrors the backend's combined goals/tasks/weeklyPlan/calendar resource) and an `ApiEnvelope<T>`/`ApiErrorEnvelope` pair in `client.ts` for the wire format — the existing domain types (`Certification`, `CareerLevel`, etc.) are reused as-is, no parallel model. `certifications.ts` normalises the backend's explicit `earnedDate: null` / `progress: null` (a deliberate backend convention) to `undefined` at the API-layer boundary rather than widening `Certification`'s existing optional fields to accept `null` everywhere they're read.
  - Configured the backend base URL via the Vite env var `VITE_API_BASE_URL` (`src/vite-env.d.ts` types it); added/updated `levelup-frontend/.env.example` with the deployed dev backend URL (`https://levelup-api-dev-dfgugzd7a0fvf47.swedencentral-01.azurewebsites.net`) and `.gitignore` rules so real `.env*` files stay untracked. Falls back to `http://localhost:4000` (the local `backend/` dev server) when unset — no Azure hostname is hard-coded in any component.
  - Left `src/data/mock.ts` in place (per the issue's instruction) — it's no longer imported by any wired page/component; `dashboardStats` and `recommendedActions` remain as unused-by-the-UI reference data (no backend contract exists for either yet).
  - Documented all of the above (API layer, env var, local-only interactions, CORS) in `levelup-frontend/README.md`.
- Decision/notes:
  - **Merge conflict with MIKK-36:** this branch was cut from `develop` before MIKK-36 (above) merged and deleted `Competencies.tsx` + the Competency feature. Rather than force-push a rebase, `origin/develop` was merged into this branch and the conflicts resolved by hand: `Competencies.tsx` stays deleted (accepted MIKK-36's removal — there's no page left to wire to `GET /api/competencies`), and `Profile.tsx` keeps MIKK-36's competency-free layout while retaining this issue's `useProfile()`/API wiring for the sections that do still exist. The `GET /api/competencies` endpoint itself is untouched on the backend and still documented in this issue's description if the Competency feature is ever reintroduced — at that point, re-adding `src/api/competencies.ts` (same shape as the other 4 resource modules here) is the fastest path back.
  - **No backend write endpoints exist** (`backend/` only exposes the 6 read-only GETs listed in this issue), so "Add certification" (Certifications), the "Start tracking"/"Mark completed" status buttons (Certifications), and the milestone/study-task checkboxes (Learning Plan) remain local-only: each page seeds its editable local `useState` from the fetched API response once, then mutates it in memory exactly as it did against mock data before this change (nothing is persisted or sent to the backend). The AI Assistant chat is unchanged — still a canned-reply simulation, no backend call, not in this issue's endpoint list.
  - **CORS finding:** the backend enables `cors()` with no origin restriction (`backend/src/app.js`), i.e. `Access-Control-Allow-Origin: *` on every response (confirmed via a local `curl -i`) — so calls from the deployed Azure Static Web App origin are **not** blocked and no frontend workaround was needed or added. If the backend is ever locked down to an explicit origin allow-list, the Static Web App's deployed origin must be added there (a backend-side change, out of scope here).
  - **Could not reach the deployed backend URL from this sandbox** (`levelup-api-dev-dfgugzd7a0fvf47.swedencentral-01.azurewebsites.net` — and the plain `<app-name>.azurewebsites.net` form — both fail DNS resolution here, `NXDOMAIN` even against `8.8.8.8`, while other `*.azurewebsites.net`-adjacent Microsoft domains and general internet access work fine from this environment). Verified the full integration instead by running the actual `backend/` source (same mock-data code that's deployed) locally on `:4000` and pointing `VITE_API_BASE_URL` at it — this is a faithful stand-in since the deployed backend is admittedly still mock-data-backed internally (per this issue's own framing) with the exact same routes/response shapes. Flagging so a run with real network access to Azure can do one final confirmation against the actual deployed URL; the integration code itself only depends on `VITE_API_BASE_URL`, so no code changes are anticipated if that check surfaces a problem, and this should be quick.
  - Chose one `ProfileContext` (React Context, mirroring the existing `LanguageContext` pattern) over adding a general-purpose cache/query library, since only `profile` is read from more than one place at once; the other resources are fetched per-page as before.
  - `Certifications.tsx` and `LearningPlan.tsx`'s goal/task state deliberately avoid a "sync from prop" `useEffect` (which triggers oxlint's `set-state-in-effect` warning and is generally discouraged by the React docs) — `LearningPlan.tsx` splits into an outer data-fetching component and an inner content component that's only mounted once data has loaded (so it naturally remounts fresh on retry), while `Certifications.tsx` uses the "adjust state during render" pattern (comparing against the last-seeded reference) since its "Add certification" button needs to live in the always-rendered `PageHead`, ruling out the same mount/unmount split.
- Open questions / risks:
  - Confirm the deployed backend URL is reachable and returns the same shapes from a network-unrestricted environment (see DNS note above) before calling this fully done end-to-end in production.
  - `npm run build` and `npm run lint` are clean (`tsc -b` + `vite build`, `oxlint`); `oxlint` has 1 new `react(only-export-components)` warning on `ProfileContext.tsx` (exporting both the provider and the `useProfile` hook from one file) — the same class of warning the pre-existing `LanguageContext.tsx` already has, from the same file-sharing pattern; no other new warnings. `backend/` tests (`npm test`, untouched by this issue) still pass 10/10.
  - No automated frontend tests exist yet (repo-wide, pre-existing gap) to regression-guard this wiring — recommend Test-Agent add coverage (loading/error/retry states, at minimum) when a test suite is introduced.
