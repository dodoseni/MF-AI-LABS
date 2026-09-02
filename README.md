# LevelUp

Competency and career development platform for Sopra Steria consultants.

LevelUp brings together certifications, learning resources, career requirements, and project evaluations in one solution. It helps consultants see which certifications they hold, which they are missing for the next level, and how to plan their professional development through study plans, tasks, and progress tracking.

## Repository layout

- `levelup-frontend/` — React 19 + TypeScript + Vite app: Dashboard, Certifications, Competency Development, Career Path, Learning Plan, AI Assistant, and Profile. Fully functional on mock data (`src/data/mock.ts`); no backend wiring yet.
- `backend/` — Express.js API skeleton (Node >= 20). Currently exposes only `GET /api/health`; no database, auth, or AI wiring yet. See `backend/README.md`.
- `docs/CHANGELOG.md` — shared, version-controlled record of completed tasks. Append an entry per task.

**Note:** an earlier `backend/`, `levelup/` (Python AI service), and `levelup-db/` (Azure SQL schema) were removed on 2026-09-02 because they were built in isolation from each other and from the frontend, never integrated, and never deployed (see the CHANGELOG entry for that date). `backend/` above is the fresh rebuild, deliberately kept minimal (health check only) until it is wired to real data.

## Architecture (target — not yet built)

| Component | Azure service | Status |
|---|---|---|
| Frontend | Azure Static Web Apps | Built (mock data) |
| Backend | Azure App Service | Minimal skeleton (`/api/health` only) |
| Database | Azure SQL Database | Not started |
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

Listens on `PORT` (default `4000`). See `backend/README.md` for details, tests, and
Azure App Service deployment notes. Currently only `GET /api/health` is implemented.

## Conventions

- Append an entry to `docs/CHANGELOG.md` for every completed task.
- Record API endpoints, data model, field names, and AI behavior in the changelog so the team builds against one agreed contract.
- Run tests/lint before handing off work.

## Branches

- `develop` — active development branch. Push work-in-progress here.
- `main` — reserved for production/release. Do not push directly.