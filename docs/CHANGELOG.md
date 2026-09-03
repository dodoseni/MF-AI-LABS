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

## 2026-09-02 — MIKK-37: Simplify Career Path, Learning Plan and Certification experience

- Component: frontend
- Issue/ref: MIKK-37
- What was done:
  - **New shared data layer** (`src/context/CertificationsContext.tsx`, `useCertifications()`): certifications now live in one React context instead of being duplicated as local `useState` per page. It also derives `careerPath` live from the certifications list — each level's `requirements[].met`/`.detail` and `progress` are recomputed from certification status (via a new `Requirement.certId` field added in `types/index.ts` + `data/mock.ts` that links each level requirement to a real certification id) rather than being hand-set flags. `App.tsx` now wraps the shell in `<CertificationsProvider>`. This is what makes "add/delete a certification → Dashboard, Career Path and Certifications all update automatically" actually true instead of three independent copies of the data.
  - **Dashboard**: removed the "Certification progress" card (progress bar + "X of Y completed") — certification progress is already shown via "Progress to Next Level" and the new "Level certifications" stat. The "Current Level" stat card no longer shows a "Next: Level 4" detail line (redundant with the hero section). "Level certifications" (`X / target`) and its detail ("N more to reach Level X") are now computed live from the current career level's requirements instead of a hardcoded `dashboardStats` mock array (which is now removed from `mock.ts`/`types/index.ts` — it was unused/dead beyond these two cards).
  - **Certifications page**: added delete — a trash icon on every certification card opens a confirmation modal ("Delete certification?" / Cancel / Delete) before removing it via `useCertifications().deleteCertification`. Add/status-update also now go through the shared context instead of local component state.
  - **Career Path page**: removed the entire right-hand sidebar — "Next level readiness" card (incl. estimated readiness date), "Missing requirements" card, and "Fast summary" card. The page now shows only the (unchanged) roadmap tracker at the top plus the selected level's detail panel (description, progress %, certification requirements/selection) full-width, matching the issue's example content exactly.
  - **Learning Plan page**: replaced entirely. Removed development goals, goal progress cards, the old flat "Active study plan" list, "Learning tips", the study calendar, weekly-plan grid and all associated mock data (`developmentGoals` usage here, `studyPlan`, `weeklyStudyPlan`, `calendarEvents`) and the now-unused `Calendar.tsx` component. Replaced with a simple per-certification study checklist (new `StudyChecklist`/`StudyChecklistItem` types, `studyChecklists` mock data): each checklist is a todo list (add item, toggle done, delete item) for one certification, and users can create a new plan by picking any certification that doesn't already have one, or delete a whole plan (with confirmation).
  - Cleanup: removed the now-dead `recommendedActions` mock array + `RecommendedAction` type and their `.action-*`/`.impact-*` CSS (already unreferenced since MIKK-32 removed the Dashboard widget that used them, just never deleted), the calendar/weekly-plan/milestone/`req-summary-item` CSS blocks, and added a `trash` icon plus generic `.icon-btn`/`.icon-btn-danger` and `.btn-danger` styles used by the new delete affordances.
- Decision/notes:
  - `developmentGoals` mock data is kept (Profile.tsx's "Active learning plans" card still reads it) since Profile wasn't in this issue's page list — see open question below.
  - Per-level progress % for `requirementMode: 'choose'` levels is computed as partial credit (`completed` cert = 1, `in-progress` cert = its `progress/100`) summed and capped against `chooseAtLeast`, then rounded to a percentage; for `requirementMode: 'all'` levels it's `completedCount/total`. This replaces the old hand-picked static `progress` numbers in `mock.ts` (e.g. Level 3 was hardcoded to `35`, now computes to `31` for the same underlying data) — the small numeric difference is expected since it's now a real calculation instead of a narrative placeholder.
  - Certifications/study-plan created through the UI are session-only (`useState`, no persistence), consistent with the rest of the app's mock-data-only architecture (no backend wiring yet, per MIKK-3/14).
  - Profile.tsx was updated to also read from `useCertifications()` (previously imported the static mock arrays directly) purely so it doesn't fall out of sync with adds/deletes made on the Certifications page — no UI/layout change on that page.
- Open questions / risks:
  - Profile's "Active learning plans" card still shows the old goal-based model (`developmentGoals`), which is now conceptually disconnected from the new Learning Plan checklist model. Profile wasn't in this issue's scope, so it was left as-is — flagging for Product Owner/next frontend pass on whether Profile should surface the new study-checklist plans instead.
  - Verified with `tsc -b` (clean), `vite build` (clean), `oxlint` (only the two pre-existing warnings, unrelated), and a local Playwright pass across Dashboard, Career Path (incl. level switching), Certifications (incl. full add → delete-with-confirmation flow) and Learning Plan (incl. add/toggle/delete checklist items and create/delete a plan) with zero console/page errors, in both English and Norwegian.

## 2026-09-03 — MIKK-42: Remove stale Competency backend mock data after MIKK-36 frontend removal

- Component: backend
- Issue/ref: MIKK-42 (follow-up to MIKK-36, which removed the Competency feature from the frontend)
- What was done:
  - `backend/src/data/learningPlan.js`: removed the `g2` ("Strengthen Sales competency to level 4") development goal and its three milestone-only calendar entries (`e6`, `e9`, `e13`) — both were confirmed absent from `levelup-frontend/src/data/mock.ts` (removed in MIKK-36) and had no other consumer in the backend mock data.
  - Removed the `/api/competencies` endpoint entirely: `src/routes/competencies.js`, `src/controllers/competenciesController.js`, `src/services/competenciesService.js`, `src/repositories/competenciesRepository.js`, `src/data/competencies.js`, `tests/competencies.test.js`, plus its registration in `src/app.js`. Updated `backend/README.md` (API table + project-structure listing) and the root `README.md`'s backend endpoint summary to match.
  - Added a regression test in `tests/learningPlan.test.js` asserting `GET /api/learning-plan` no longer returns goal `g2` or calendar events `e6`/`e9`/`e13`.
  - Verified with `npm ci && npm test` — 6 suites / 11 tests passing (was 6 suites / 10 tests; competencies suite removed, one assertion added to learningPlan suite).
- Decision/notes:
  - `/api/competencies` was a decision point flagged in the issue ("review and determine whether it should remain or be removed"). Removed rather than kept: the Competency feature was a deliberate product-scope cut in MIKK-36 (nav, pages, components, dashboard refs all deleted), the backend has no live wiring to the frontend yet (nothing calls any `/api/*` endpoint today — the frontend is still fully mock-data-driven per the MIKK-3/MIKK-14 decisions), and every backend mock dataset here exists specifically to mirror the frontend's mock shape. Keeping a mock endpoint for a feature the product no longer has would just be more stale mock data of exactly the kind this issue is cleaning up.
  - Left `backend/src/data/learningPlan.js`'s `tasks`/`weeklyPlan`/`calendar` (minus e6/e9/e13) and the rest of `goals` (g1/g3/g4) in place, and did not touch `/api/learning-plan` beyond the three IDs named in the issue. Note for the team: `levelup-frontend`'s MIKK-37 pass (after MIKK-36) replaced the entire Learning Plan page/mock model (dropped `calendarEvents`, `weeklyStudyPlan`, `studyPlan` from the frontend altogether, in favor of per-certification study checklists) — so the backend's `/api/learning-plan` endpoint (goals+tasks+weeklyPlan+calendar) no longer mirrors *any* current frontend page, not just the 3 removed IDs. That's a larger reconciliation than this issue's explicit scope (which named only g2/e6/e9/e13) and is unaffected by the "do not touch frontend" instruction either way — flagging for Product Owner/Full-Stack Developer as a follow-up: either retire `/api/learning-plan` similarly to `/api/competencies`, or redesign it to match the new study-checklist model.
  - Did not touch SQL, AI, Azure, or any frontend code, per the issue's explicit constraints.
- Open questions / risks:
  - See the `/api/learning-plan` vs. current frontend model note above — recommend a follow-up issue rather than silently expanding this one's scope.

## 2026-09-03 — MIKK-46: Redesign GET /api/learning-plan to match current StudyChecklist frontend model

- Component: backend
- Issue/ref: MIKK-46 (follows MIKK-37, which replaced the frontend Learning Plan model with `StudyChecklist[]`)
- What was done:
  - Replaced the backend's stale learning-plan contract (`goals` + `milestones`, generic `tasks`, `weeklyPlan`, `calendar`) — left over from the pre-MIKK-37 frontend model — with `StudyChecklist[]`, matching `levelup-frontend/src/types/index.ts` (`StudyChecklist`, `StudyChecklistItem`) and `levelup-frontend/src/data/mock.ts` (`studyChecklists`) field-for-field.
  - `backend/src/data/learningPlan.js`: removed `goals`/`tasks`/`weeklyPlan`/`calendar`; now exports `studyChecklists`, mirroring the frontend's single `plan-az-305` seed checklist exactly (same ids, `certificationId: 'az-305'`, `certificationName`, and all 7 items with matching `id`/`label`/`done`).
  - `backend/src/repositories/learningPlanRepository.js`: replaced `findGoals`/`findTasks`/`findWeeklyPlan`/`findCalendarEvents` with a single `findAll()` (async/Promise-based, same drop-in-Azure-SQL-later convention as the other repositories).
  - `backend/src/services/learningPlanService.js`: `getLearningPlan()` now returns the repository's `StudyChecklist[]` directly (no more goals/tasks/weeklyPlan/calendar aggregation).
  - `backend/src/controllers/learningPlanController.js`: unchanged — already wraps the service result as `{ "data": ... }`; now wraps an array instead of an object, per the target contract. Route unchanged: `GET /api/learning-plan`.
  - `backend/tests/learningPlan.test.js`: rewritten — asserts `200` + `{ data: [...] }`, that every plan has `id`/`certificationId`/`certificationName`/`items`, every item has `id`/`label`/`done`, and that the old `goals`/`tasks`/`weeklyPlan`/`calendar` keys are absent from both the top-level payload and each plan.
  - `backend/README.md`: updated the `/api/learning-plan` API table row and added a dedicated explanatory paragraph (mirrors the existing `/api/career-levels` paragraph pattern); removed all documentation of the obsolete goals/tasks/weeklyPlan/calendar shape; noted that checklist add/toggle/delete remains frontend-local (`useState`, no persistence) and this endpoint stays `GET`-only.
- Decision/notes:
  - Contract alignment verified by running the live endpoint and diffing byte-for-byte against `levelup-frontend/src/data/mock.ts`'s `studyChecklists`: ids, `certificationId`, `certificationName`, all 7 item ids/labels, and `done` booleans match exactly.
  - Kept the route path unchanged (`GET /api/learning-plan`) per Product Owner decision — this is a contract redesign of an existing route, not a new endpoint.
  - No write endpoints added (POST/PUT/PATCH/DELETE) — out of scope per the issue; the frontend's add/toggle/delete-item/delete-plan interactions remain component-local state only, consistent with the rest of the mock-data-only backend.
  - Left `backend/src/data/certifications.js`/`careerLevels.js`/`competencies.js`/`profile.js` and their repositories/services/controllers untouched — this issue only touched the learning-plan slice.
- Tests: `cd backend && npm ci && npm test` → 7 suites / 13 tests passing (all endpoints, including the rewritten learning-plan suite).
- Open questions / risks:
  - Frontend and backend still hold two independent copies of the study-checklist seed data (frontend `useState` initialized from its own mock array; backend serves its own mirrored mock array) since the frontend isn't wired to this endpoint yet — that wiring is still tracked under the existing Phase 2 plan (MIKK-14) and wasn't in this issue's scope.
  - Future Azure SQL persistence: `findAll()` on `learningPlanRepository.js` is the only seam a real implementation needs to replace; a durable schema should key checklists by `(user_id, certification_id)` and items by `(checklist_id)` with a `done` boolean, so add/toggle/delete can eventually become real write endpoints without changing the response shape documented here.

## 2026-09-03 — MIKK-47: QA validation of redesigned GET /api/learning-plan contract (MIKK-46, branch agent/back-end-developer/090294b133d2)

- Component: QA
- Issue/ref: MIKK-47 (validates MIKK-46, commit `22b0905`)
- What was done:
  - Checked out `agent/back-end-developer/090294b133d2` at commit `22b0905` (matches issue spec exactly). Ran `npm ci && npm test`: 7 suites / 13 tests passing.
  - Verified `GET /api/learning-plan` → `200 { data: [...] }` with `StudyChecklist[]` shape (`id`/`certificationId`/`certificationName`/`items[].{id,label,done}`); confirmed old contract (`goals`/`tasks`/`weeklyPlan`/`calendar`) absent from both the top-level payload and every plan (manual curl + `learningPlan.test.js` assertions).
  - Diffed the live response against `levelup-frontend/src/data/mock.ts` (`studyChecklists`) and `src/types/index.ts` (`StudyChecklist`/`StudyChecklistItem`) on current `origin/develop`: exact field-for-field match (plan id `plan-az-305`, `certificationId: az-305`, `certificationName`, all 7 item ids/labels/`done` values).
  - Manually started the backend (`node src/server.js`) and curled every current route: `/api/health` → 200, `/api/profile` → 200, `/api/certifications` → 200, `/api/career-levels` → 200, `/api/learning-plan` → 200 (as above), unknown route → 404. **`GET /api/competencies` → 200 with data, not the expected 404** — see defect below.
  - Confirmed architecture: routes → controllers → services → repositories → data preserved; `learningPlanRepository.js` exposes exactly one async method (`findAll()`); route/controller contain no inline mock data.
  - Confirmed the commit itself (`git show --stat 22b0905`) touches only `backend/README.md`, `backend/src/data/learningPlan.js`, `backend/src/repositories/learningPlanRepository.js`, `backend/src/services/learningPlanService.js`, `backend/tests/learningPlan.test.js`, `docs/CHANGELOG.md` — no `levelup-frontend/`, `.github/workflows/`, SQL/database, Azure config, AI/Foundry, auth, or other API-contract changes.
  - Merge-conflict assessment (`git merge-tree` against current `origin/develop`, `f40678a`): **real conflicts found**. The branch was cut before MIKK-42 (`3ca76d3`, already merged to `develop` via PR #16) landed, which removed the backend `/api/competencies` slice entirely and left `/api/learning-plan`'s old goals/tasks/weeklyPlan/calendar data in place pending exactly this redesign. Merging as-is conflicts on `backend/src/data/learningPlan.js` (branch's `StudyChecklist[]` vs. develop's still-old goals/tasks/weeklyPlan/calendar) and on `docs/CHANGELOG.md` (both branches appended entries in the same location). The `/api/competencies` file removals apply cleanly (branch never touched those files), so `/api/competencies` will correctly disappear once merged/rebased — it is only present with this branch checked out standalone.
- Decision/notes: the MIKK-46 implementation itself is correct and fully matches the target contract; the only issue is branch staleness relative to `develop`, which surfaces as (a) two real, resolvable merge conflicts and (b) a stale `/api/competencies` 200 that will self-resolve once rebased.
- Open questions / risks:
  - Recommend rebasing/merging `agent/back-end-developer/090294b133d2` onto current `origin/develop` (picking the branch's `StudyChecklist[]` for `learningPlan.js` and keeping both `docs/CHANGELOG.md` entries) before merge, then re-running `npm test` and re-curling `/api/competencies` to confirm 404 post-rebase.

## 2026-09-03 — MIKK-48: Rebase Learning Plan redesign branch (agent/back-end-developer/090294b133d2) onto current develop

- Component: backend
- Issue/ref: MIKK-48 (resolves the staleness Test-Agent flagged in MIKK-47)
- What was done:
  - Rebased `agent/back-end-developer/090294b133d2` (MIKK-46 `22b0905` + MIKK-47 `551b50e`) onto current `origin/develop` (`f40678a`, which already contains MIKK-42's full `/api/competencies` removal).
  - Resolved the `backend/src/data/learningPlan.js` conflict by keeping the branch's `StudyChecklist[]` model as-is (`plan-az-305` + 7 items) and discarding develop's now-superseded `goals`/`tasks`/`weeklyPlan`/`calendar` mock data entirely — none of MIKK-42's `g2`/`e6`/`e9`/`e13` removals were relevant since that whole model is gone.
  - Resolved the `docs/CHANGELOG.md` conflict by keeping both the MIKK-42 (develop) and MIKK-46/47 (branch) entries, in date order, no duplication.
  - Found and removed one additional problem the git auto-merge introduced without flagging a conflict: `backend/tests/learningPlan.test.js` had auto-merged in develop's MIKK-42 regression test (`does not include the removed Competency goal...`, asserting on `data.goals`/`data.calendar`) alongside the branch's rewritten StudyChecklist assertions. That test is for a model that no longer exists post-MIKK-46, so it was deleted (amended into the MIKK-46 commit via `git rebase -i --edit`) rather than left to fail.
  - Verified final backend API surface: `GET /api/health`, `/api/profile`, `/api/certifications`, `/api/career-levels`, `/api/learning-plan` all → 200; `GET /api/competencies` → 404 (route/controller/service/repository/data/test all absent, confirmed via `find backend -iname "*competenc*"` returning nothing and `app.js` having no registration).
  - Ran `cd backend && npm ci && npm test`: 6 suites / 12 tests passing.
  - Confirmed `GET /api/learning-plan` response is byte-for-byte identical to `levelup-frontend/src/data/mock.ts`'s `studyChecklists` and matches `StudyChecklist`/`StudyChecklistItem` in `levelup-frontend/src/types/index.ts`.
  - Confirmed no changes outside `backend/` (learning-plan slice only) and `docs/CHANGELOG.md`: no diff vs. `origin/develop` in `levelup-frontend/`, `.github/workflows/`, SQL/database, Azure config, AI/Foundry, or auth.
  - `git merge-tree --write-tree origin/develop HEAD` succeeds cleanly (no conflicts) — branch now merges into `develop` with zero manual intervention.
  - Force-pushed the rebased branch to `origin/agent/back-end-developer/090294b133d2` (history rewritten by the rebase; `--force-with-lease`).
- Decision/notes:
  - Did not restore any Competency backend code or docs — MIKK-42's removal is fully preserved.
  - Did not restore `goals`/`tasks`/`weeklyPlan`/`calendar` — the StudyChecklist[] contract from MIKK-46 is the sole surviving Learning Plan model, per this issue's explicit instruction not to redesign again.
- Tests: `cd backend && npm ci && npm test` → 6 suites / 12 tests passing. Manual curl of all 6 routes above confirms the contract live.
- Open questions / risks: None. Branch is rebased on latest `develop`, conflict-free to merge, tests green, endpoint surface verified both automatically and manually.

## 2026-09-03 — MIKK-49: Final post-rebase QA validation of Learning Plan backend redesign

- Component: QA
- Issue/ref: MIKK-49 (independent verification of MIKK-48's rebase)
- What was done:
  - Independently re-ran `cd backend && npm ci && npm test` on `agent/back-end-developer/090294b133d2` @ `67867ad`: 6 suites / 12 tests passing.
  - Started the server (`node src/server.js`) and curled all 6 endpoints: `/api/health`, `/api/profile`, `/api/certifications`, `/api/career-levels`, `/api/learning-plan` → 200; `/api/competencies` → 404.
  - Confirmed `GET /api/learning-plan` response body matches the required `StudyChecklist[]` shape exactly, and is identical to `levelup-frontend/src/data/mock.ts`'s `studyChecklists` and the `StudyChecklist`/`StudyChecklistItem` interfaces in `levelup-frontend/src/types/index.ts`.
  - Grepped `backend/src` for `goals`/`tasks`/`weeklyPlan`/`calendar` fields: none found (only historical comments noting their removal).
  - Grepped for any `competenc*` route/controller/service/repository/data/test files: none found; `app.js` has no competencies route registration.
  - Verified mergeability: `merge-base HEAD origin/develop` shows `origin/develop` (`f40678a`) is an ancestor of the branch, and a scratch `git merge --no-commit --no-ff origin/agent/back-end-developer/090294b133d2` onto fresh `origin/develop` completed cleanly (exit 0, no conflicts). (Note: a stale local branch cache named identically but pointing at an older commit, `22b0905`, existed in this checkout's git object store and produced a false-positive conflict on first attempt — the actual remote ref `origin/agent/back-end-developer/090294b133d2` is at `67867ad` and merges clean.)
  - Confirmed `git diff origin/develop..HEAD --stat` touches only `backend/README.md`, `backend/src/data/learningPlan.js`, `backend/src/repositories/learningPlanRepository.js`, `backend/src/services/learningPlanService.js`, `backend/tests/learningPlan.test.js`, and `docs/CHANGELOG.md` — no `levelup-frontend/`, `.github/workflows/`, SQL, Azure, AI/Foundry, or auth changes.
- Decision/notes: All MIKK-49 acceptance checks pass; findings corroborate MIKK-48's self-reported verification.
- Open questions / risks: None blocking. Result: PASS, recommendation MERGE.
