# LevelUp

Competency and career development platform for Sopra Steria consultants.

LevelUp brings together certifications, learning resources, career requirements, and project evaluations in one solution. It helps consultants see which certifications they hold, which they are missing for the next level, and how to plan their professional development through study plans, tasks, and progress tracking.

## Repository layout

- `backend/` — Express.js API (Azure App Service). Health endpoint at `GET /api/health`, Azure SQL + AI service stubs.
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

## Conventions

- Append an entry to `docs/CHANGELOG.md` for every completed task.
- Record API endpoints, data model, field names, and AI behavior in the changelog so the team builds against one agreed contract.
- Run tests/lint before handing off work.