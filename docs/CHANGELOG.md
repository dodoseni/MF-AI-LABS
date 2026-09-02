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

## 2026-09-02 — MIKK-19: Interim backend — realistic mock data + generated PDF/CSV (demo-ready)

- Component: backend
- Issue/ref: MIKK-19 (P2-09) — unblocks a live demo today without waiting on MIKK-10/11 (Azure provisioning)
- What was done:
  - Added `backend/src/data/` mock data layer: `catalog.js` (certification catalog, 5 competency areas, job-family levels, career-level requirement definitions — same ids/field names as `levelup-db/seed.sql` and `levelup-frontend/src/data/mock.ts`), `users.js` (3 seeded consultants at different career stages with per-user certifications, competencies, career progress, development goals + milestones, study plan), and `repository.js` — the single seam all routes call through.
  - Replaced the health-only API with 6 real, working route groups (all under `/api`, all Express + supertest-tested): `certifications`, `competencies`, `career`, `learning-plans`, `manager`, `users`.
  - Added on-the-fly PDF generation (`pdfkit`) for certification certificates and on-the-fly CSV generation (`csv-stringify`) for certification/competency exports — nothing static on disk.
  - Added Jest/supertest coverage for every new endpoint (status codes, response shape, PDF magic bytes, CSV header row). 17/17 tests pass; `npm run lint` clean.
- Decision/notes — **endpoint contract for MIKK-14 (frontend) and MIKK-13 (real Azure SQL later)**:
  - No auth yet (MIKK-12 pending) — every user-scoped endpoint takes an optional `?userId=<id>` query param; omitting it defaults to `usr-amalie-berg`. `GET /api/users` lists the 3 demo consultants (`usr-amalie-berg`, `usr-jonas-eide`, `usr-kristine-solberg`) so the frontend can offer a "view as" switcher during the demo.
  - `GET /api/certifications?userId=` → `{ userId, userName, currentLevel, summary: { held, total, requiredHeld, requiredTotal, percent }, certifications: [{ id, name, issuer, category, level, status, earnedDate, progress, requiredFor, description, sourceUrl }] }`. `status` ∈ `completed|in-progress|missing|recommended` (matches `user_certification.status` in `levelup-db/schema.sql`); `progress` only present when `in-progress`.
  - `GET /api/certifications/export.csv?userId=` → `text/csv`, columns `id,name,issuer,category,level,status,earnedDate,progress,requiredFor,description`.
  - `GET /api/certifications/:id/certificate.pdf?userId=` → `application/pdf` (generated with `pdfkit`, includes consultant name, cert name, issuer, level, earned date). Returns `404` for an unknown cert/user, `409` if the user hasn't completed that cert yet (no certificate to issue).
  - `GET /api/competencies?userId=` → `{ userId, userName, currentLevel, averageCurrent, averageTarget, areas: [{ area, label, description, current, target, previous, gap }] }` for the 5 fixed areas (`Sales, Delivery, Manage, Entrepreneurship, Develop` — same codes as `competency_area.code`).
  - `GET /api/competencies/export.csv?userId=` → `text/csv`, columns `area,label,current,target,previous,gap`.
  - `GET /api/career/levels?userId=` → `{ userId, userName, currentLevel, nextLevel, levels: [{ id, name, role, description, yearsExperience, color, progress, status, requirements: [{ label, met, detail }] }] }`. `id` = job-family `level_code` (`consultant|senior|principal|architect|expert`). Semantics: levels at/below the user's actual level are `status: 'completed'` (progress 100); the very next level is `status: 'current'` (progress = advancement %, requirements evaluated against the user's real certs/competencies); everything beyond is `status: 'upcoming'` (locked, progress 0). This mirrors `levelup-frontend/src/data/mock.ts` `careerPath` exactly for the default user.
  - `GET /api/learning-plans?userId=` → `{ userId, userName, goals: [{ id, title, category, status, progress, dueDate, milestones: [{ id, label, date, done }] }], studyPlan: [{ id, title, source, duration, completed, type }] }`.
  - `GET /api/manager/overview` (no userId — team-wide) → `{ generatedAt, teamSize, consultants: [{ userId, name, role, office, currentLevel, certifications: { held, total, percent }, competencies: { averageCurrent, averageTarget, gapAreas }, activeGoals }] }`.
  - All 404s (unknown user/cert) and other errors go through the existing `errorHandler` middleware → `{ error: "<message>" }`; error logging now only prints a full stack trace for 5xx, a one-line `console.warn` for 4xx (keeps test/demo logs readable).
  - Data is intentionally realistic and internally consistent per user: e.g. `usr-amalie-berg` (Senior Consultant) holds AZ-900/104/204, is 62% through AZ-305, and her career-path/competency/learning-plan data all tell the same "advancing toward Principal" story; `usr-jonas-eide` (junior Consultant) and `usr-kristine-solberg` (Principal, advancing toward Architect) tell their own coherent stories.
  - This is explicitly the interim/demo data source. `backend/src/data/repository.js` is the only file that should change when MIKK-13 swaps in real Azure SQL (via `levelup-db/views.sql`); route files and response shapes are designed to stay stable.
- Open questions / risks:
  - No auth/session yet, so `userId` is a trusted query param — must be replaced by a real identity claim once MIKK-12 (Entra ID) lands; do not ship this query-param pattern to production.
  - `manager/overview` returns the full 3-user roster with no manager/team scoping — fine for a demo, will need a real reporting-line model once real data lands.
  - Generated certificate PDFs are a simple demo layout (not an official Microsoft credential template) — flagged as such in the PDF footer.