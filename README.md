# LevelUp

Competency and career development platform for Sopra Steria consultants.

LevelUp brings together certifications, learning resources, career requirements, and project evaluations in one solution. It helps consultants see which certifications they hold, which they are missing for the next level, and how to plan their professional development through study plans, tasks, and progress tracking.

## Repository layout

- `backend/` — Express.js API (Azure App Service). Real working endpoints backed by an interim mock data layer (`backend/src/data/`): certifications, competencies, career levels, learning plans, manager overview, plus generated PDF certificates and CSV exports. See `docs/CHANGELOG.md` for the full endpoint contract. Azure SQL + AI service clients remain stubbed pending provisioning (MIKK-10/11).
- `levelup/` — AI assistant service: FastAPI backend with Azure OpenAI chat + RAG (Azure AI Search), chat UI, infra (Terraform, K8s, Docker Compose). See `levelup/backend/app.py`.
- `levelup-db/` — Azure SQL (T-SQL) data model: schema, seed, and views for certifications, competency areas, the Job Family framework, and career levels.
- `levelup-frontend/` — React 19 + TypeScript + Vite app: Dashboard, Certifications, Competency Development, Career Path, Learning Plan, and AI Assistant. Uses mock data until the backend is available.
- `docs/CHANGELOG.md` — shared, version-controlled record of completed tasks. Append an entry per task.

## Architecture (bare minimum)

| Component | Azure service |
|---|---|
| Frontend | Azure Static Web Apps |
| Backend | Azure App Service |
| Database | Azure SQL Database |
| Authentication | Microsoft Entra ID |
| AI assistant | Azure OpenAI |
| Document storage | Azure Blob Storage |
| Document search (RAG) | Azure AI Search |

## Getting started

### Prerequisites

- Node.js ≥ 18 (frontend and backend)
- Python 3.10+ for the AI assistant
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

### 2. Backend API

```bash
cd backend
npm install
npm run dev        # starts on http://localhost:4000
```

Verify it is up: http://localhost:4000/api/health

Tests + lint:

```bash
npm test
npm run lint
```

Environment (optional until Azure resources exist): `PORT`, `DB_SERVER`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `AI_ENDPOINT`, `AI_API_KEY`. By default it runs without Azure — SQL and AI calls are stubbed.

### 3. AI assistant (Azure OpenAI + RAG + Entra ID)

Needs real Azure resources. Configure from `levelup/.env.example`:

```bash
cd levelup
cp .env.example .env   # then fill in Azure OpenAI, AI Search, and Entra ID values
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

Server runs at http://localhost:8000. Seeding documents into Azure AI Search is a separate CLI step (`levelup/infra/blob-seed/seed.py`). A simpler local option is Docker Compose from `levelup/` (`docker compose up`).

### 4. Data model (Azure SQL)

Apply the scripts in order to a target Azure SQL database:

```bash
cd levelup-db
sqlcmd -S <server>.database.windows.net -d <db> -i schema.sql
sqlcmd -S <server>.database.windows.net -d <db> -i seed.sql
sqlcmd -S <server>.database.windows.net -d <db> -i views.sql
```

All scripts are idempotent and safe to re-run. See `levelup-db/README.md` for the full entity overview.

## Conventions

- Append an entry to `docs/CHANGELOG.md` for every completed task.
- Record API endpoints, data model, field names, and AI behavior in the changelog so the team builds against one agreed contract.
- Run tests/lint before handing off work.

## Branches

- `develop` — active development branch. Push work-in-progress here.
- `main` — reserved for production/release. Do not push directly.