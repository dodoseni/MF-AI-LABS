# LevelUp

Competency and career development platform for Sopra Steria consultants.

LevelUp brings together certifications, learning resources, career requirements, and project evaluations in one solution. It helps consultants see which certifications they hold, which they are missing for the next level, and how to plan their professional development through study plans, tasks, and progress tracking.

## Repository layout

- `levelup-frontend/` — React 19 + TypeScript + Vite app: Dashboard, Certifications, Competency Development, Career Path, Learning Plan, AI Assistant, and Profile. Wired to the backend API (profile, certifications, career-levels, learning-plan) since MIKK-52; falls back to mock data with an on-screen notice if the API is unreachable.
- `backend/` — Express.js API (Node >= 20). `GET /api/health` plus `/api/profile`, `/api/certifications`, `/api/career-levels`, `/api/learning-plan`. Prisma + Azure SQL are live (MIKK-51/53/56) for a `DatabaseSmokeTest` verification table only — `Certification`, `CareerLevel`, `Profile`, and `learning-plan` are still read from local mock data (`src/data/`). Auth and AI wiring are still not started. See `backend/README.md`.
- `docs/CHANGELOG.md` — shared, version-controlled record of completed tasks. Append an entry per task.


## Architecture (target — partially built)

| Component | Azure service | Status |
|---|---|---|
| Frontend | Azure Static Web Apps | Built, wired to the backend API (MIKK-52) |
| Backend | Self-hosted Azure VM (system-assigned Managed Identity) | Read-only API contracts, live and validated end-to-end (MIKK-56). Azure App Service (`levelup-api-dev`) may also exist but is unconfirmed as a real target — see `backend/README.md`. |
| Database | Azure SQL Database (via Prisma) | Live for the `DatabaseSmokeTest` verification table only (MIKK-51/53/56), resolved via Key Vault + the VM's Managed Identity. `Certification`, `CareerLevel`, `Profile`, and `learning-plan` are still mock-data-backed — not yet migrated. |
| Authentication | Microsoft Entra ID | Not started |
| AI assistant | Azure OpenAI | Not started |
| Document storage | Azure Blob Storage | Not started |
| Document search (RAG) | Azure AI Search | Not started |

## Getting started

### Prerequisites

- Node.js ≥ 18 (frontend)
- Git

### 1. Frontend UI (runnable without a backend — mock data)

```bash
cd levelup-frontend
npm install
npm run dev
```

Open http://localhost:5173 (Vite's default) in a browser. This shows the full UI — Dashboard, Certifications, Competency Development, Career Path, Learning Plan, and AI Assistant — using mock data.

Build for production:

```bash
npm run build && npm run preview
```

Lint:

```bash
npm run lint
```

### 2. Backend

```bash
cd backend
npm install
npm start
```

Listens on `PORT` (default `4000`). See `backend/README.md` for the full endpoint list,
tests, and deployment notes. Endpoints are read-only. Prisma + Azure SQL are live for a
`DatabaseSmokeTest` verification table (`GET /api/db-test`); the product endpoints
(`/api/profile`, `/api/certifications`, `/api/career-levels`, `/api/learning-plan`) are
still backed by local mock data (`backend/src/data/`).

## Conventions

- Append an entry to `docs/CHANGELOG.md` for every completed task.
- Record API endpoints, data model, field names, and AI behavior in the changelog so the team builds against one agreed contract.
- Run tests/lint before handing off work.

## Branches

- `develop` — active development branch. Push work-in-progress here.
- `main` — reserved for production/release. Do not push directly.
