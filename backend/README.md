# LevelUp Backend

Express.js backend for the LevelUp platform. Most endpoints expose read-only REST API
contracts for the frontend, currently backed by **local mock data**. Authentication and
AI/Foundry integration are intentionally out of scope for this stage and will be built as
separate, tracked follow-up work.

`/api/projects` (MIKK-38) is the exception: it is a real, Azure SQL-backed smoke-test
endpoint pair proving the connectivity chain Backend API -> Azure SQL, using passwordless
Azure AD auth via the App Service's Managed Identity — see "Azure SQL connectivity" below.

## Required Node version

Node.js **>= 20** (see `engines.node` in `package.json`).

## Installation

```bash
cd backend
npm install
```

## Local startup

```bash
npm start
```

This runs `node src/server.js`. The server binds to `0.0.0.0` and listens on
`process.env.PORT`, falling back to **4000** when `PORT` is not set.

For local development with auto-restart on file changes:

```bash
npm run dev
```

Once running, verify the health endpoint:

```bash
curl http://localhost:4000/api/health
# {"status":"ok"}
```

Local base URL: **`http://localhost:4000`** (all product endpoints below are under `/api`).

## Tests

```bash
npm test
```

Runs the Jest + Supertest suite. At minimum it verifies each endpoint returns HTTP 200
(and that unknown routes return HTTP 404), plus a basic shape check for every response so
accidental contract changes are caught.

## API

Most endpoints are read-only (`GET` only) and mock-data-backed. Successful responses are
`HTTP 200` JSON; list endpoints wrap their payload as `{ "data": [...] }`, single-resource
endpoints as `{ "data": {...} }`. Unknown routes return `HTTP 404` with
`{ "error": "Not Found" }`; unexpected errors are handled by the centralized error handler
in `src/app.js`.

| Method | Path | Description | Shape |
|---|---|---|---|
| GET | `/api/health` | Liveness check. | `{ "status": "ok" }` |
| GET | `/api/profile` | The current mock user's profile (identity, `level`/`nextLevel` as `"Level N"`, office). | `{ "data": { ...profile } }` |
| GET | `/api/certifications` | All certifications (status, category, level, progress, `requiredFor: ["Level 1".."Level 3"]`, description). | `{ "data": [ ...certifications ] }` |
| GET | `/api/competencies` | The five competency areas (current/target/previous self-assessment levels). | `{ "data": [ ...competencies ] }` |
| GET | `/api/career-levels` | Career roadmap Level 1 → Level 4, in progression order, each with `requirementMode` (`all`/`choose`/`holistic`), `requirementNote`, `chooseAtLeast` (when `choose`), `requirements`, and `focusAreas` (when `holistic`). | `{ "data": [ ...careerLevels ] }` |
| GET | `/api/learning-plan` | The user's learning plan: development goals (+ milestones), study tasks, weekly plan, calendar events. | `{ "data": { "goals": [...], "tasks": [...], "weeklyPlan": [...], "calendar": [...] } }` |
| POST | `/api/projects` | **Azure SQL-backed (not mock).** Body `{ "name": string }`. Inserts into `dbo.Projects` and returns the persisted row. `400` if `name` is missing/blank. | `201` → `{ "data": { "id": number, "name": string, "createdAt": string } }` |
| GET | `/api/projects` | **Azure SQL-backed (not mock).** All projects, most recently created first. | `{ "data": [ { "id", "name", "createdAt" }, ... ] }` |

## Azure SQL connectivity (`/api/projects`, MIKK-38)

`/api/projects` is a deliberately minimal smoke-test endpoint pair proving the connectivity
chain **Backend API (`levelup-api-dev`) -> Azure SQL** end-to-end, using **passwordless Azure
AD auth** via the App Service's system-assigned Managed Identity — no SQL login, password,
or Key Vault secret is involved anywhere in this path (there is no secret to protect).

- **Connection module**: `src/db/pool.js` — a lazily-created, shared `mssql` connection pool
  using `authentication: { type: 'azure-active-directory-default' }`. This delegates token
  acquisition to `DefaultAzureCredential` (via `@azure/identity`, used internally by the
  `tedious` driver), which resolves the App Service's Managed Identity automatically in
  Azure, or falls back to local `az login` credentials for local dev (provided the
  developer's AAD account also has database access).
- **Data flow**: `routes/projects.js` -> `controllers/projectsController.js` ->
  `services/projectsService.js` (name validation/trimming) ->
  `repositories/projectsRepository.js` (the only layer that talks to `mssql`).
- **Table**: `dbo.Projects (Id INT IDENTITY, Name NVARCHAR(200), CreatedAt DATETIME2 DEFAULT
  SYSUTCDATETIME())`, provisioned by `backend/sql/2026-09-02-projects-smoketest.sql`
  (Data Engineer, MIKK-38) — a scoped, disposable smoke-test table, intentionally separate
  from the real LevelUp data model.
- **Env vars** (plain App Service **Application Settings**, not secrets — no Key Vault
  reference needed for this auth mode):
  - `SQL_SERVER=mikkelrev.database.windows.net`
  - `SQL_DATABASE=mikelrev`
  Locally, export the same two variables (and run `az login` as an AAD principal that has
  been granted DB access) before `npm start`; without them, `POST`/`GET /api/projects` will
  fail to connect (all other endpoints are unaffected — they remain mock-data-backed).
- **Tests**: `tests/projects.test.js` mocks `src/db/pool.js` (not the real `mssql`/Azure SQL)
  so `npm test` never requires network access or a Managed Identity — consistent with how
  every other endpoint here is unit-tested against a fake data layer.
- **Deviation from the original spec**: the `INSERT` uses `OUTPUT INSERTED.Id,
  INSERTED.Name, INSERTED.CreatedAt` instead of a separate `SELECT SCOPE_IDENTITY()` — this
  returns the exact `CreatedAt` value SQL Server generated (via the column's `DEFAULT
  SYSUTCDATETIME()`) in the same round trip, rather than requiring the app to compute or
  re-query for it.
- **Infra preconditions** (not this code's responsibility, tracked by Data Engineer/PO):
  system-assigned Managed Identity turned on for `levelup-api-dev`; the smoke-test SQL
  script run against `mikelrev` by an AAD admin; Azure SQL firewall allowing the App
  Service to connect; `SQL_SERVER`/`SQL_DATABASE` App Settings added to `levelup-api-dev`.
  Until all four are in place, `/api/projects` will fail at runtime in Azure even though
  the code and tests here are complete and green.

**Career levels (`/api/career-levels`).** The roadmap is `Level 1` (Foundation) → `Level 2`
(Specialisation) → `Level 3` (Leadership track) → `Level 4` (Strategic impact), replacing the
former consulting-title roadmap (Consultant / Senior Consultant / Principal Consultant /
Enterprise Architect) as of MIKK-28. `requirementMode` describes how to read `requirements`:
`'all'` (hold every listed certification — Level 1), `'choose'` (hold at least
`chooseAtLeast` of the listed certifications — Level 2 and 3), or `'holistic'` (no fixed
certification list; see `focusAreas` instead — Level 4). `certifications[].requiredFor`
references these same `"Level 1"`.."Level 3"` values (Level 4 has no certification
requirements).

**Data is temporary mock data.** Every response currently comes from static objects/arrays
in `src/data/`, wired through a repository layer (see below) rather than a database. This
lets the frontend build and stabilize against a real API contract before an actual Azure
SQL–backed implementation exists — swapping the repository layer is intended to be a
drop-in change with no impact on routes, controllers, or the public API shape.

## Project structure

```
backend/
  src/
    app.js               # Express app: middleware, routes, error handling
    server.js             # HTTP server bootstrap (PORT binding)
    db/
      pool.js              # Azure SQL connection pool (passwordless Azure AD auth)
    routes/                # Express routers — map path -> controller, no logic
      health.js
      profile.js
      certifications.js
      competencies.js
      careerLevels.js
      learningPlan.js
      projects.js
    controllers/           # req/res handling — call a service, shape the HTTP response
      profileController.js
      certificationsController.js
      competenciesController.js
      careerLevelsController.js
      learningPlanController.js
      projectsController.js
    services/              # Business logic — currently pass-through to repositories
      profileService.js
      certificationsService.js
      competenciesService.js
      careerLevelsService.js
      learningPlanService.js
      projectsService.js    # + name validation (the one service with real logic)
    repositories/          # Data access — the ONLY layer that knows data is mocked
      profileRepository.js         #   (or, for projectsRepository.js, real Azure SQL).
      certificationsRepository.js  #   Promise-based on purpose: a future Azure SQL
      competenciesRepository.js    #   repository only needs to keep the same method
      careerLevelsRepository.js    #   names/shapes for routes/controllers/services to
      learningPlanRepository.js    #   keep working unchanged.
      projectsRepository.js        #   (Azure SQL-backed — see below)
    data/                  # Local mock datasets, aligned with levelup-frontend/src/data/mock.ts
      profile.js
      certifications.js
      competencies.js
      careerLevels.js
      learningPlan.js
  sql/
    2026-09-02-projects-smoketest.sql  # dbo.Projects table + Managed Identity DB user/grants
  tests/
    health.test.js
    profile.test.js
    certifications.test.js
    competencies.test.js
    careerLevels.test.js
    learningPlan.test.js
    notFound.test.js
    projects.test.js
  package.json
```

## Azure App Service deployment notes

- The app **must** listen on `process.env.PORT` — Azure App Service (Linux) injects this
  environment variable at runtime and routes external traffic to it. The server already
  reads `process.env.PORT` with a local fallback of `4000`, so no code changes are needed
  for deployment.
- Binding to `0.0.0.0` (already done in `src/server.js`) is required so the container's
  network interface accepts external connections from the App Service front end.
- Set the App Service **Node version** to `>= 20` (Configuration → General settings →
  Stack settings, or via `WEBSITE_NODE_DEFAULT_VERSION` / the Linux runtime stack setting).
- App Service runs `npm install` automatically during deployment (Oryx build) and then
  the `start` script (`npm start`) to launch the app — no custom startup command is
  required as long as deployment targets the `backend/` directory as the app root.
- For `/api/projects` (MIKK-38) to work in Azure, add `SQL_SERVER` and `SQL_DATABASE` as
  App Service **Application Settings** (see "Azure SQL connectivity" above) and ensure the
  App Service's system-assigned Managed Identity is turned on. These are plain settings,
  not secrets — no Key Vault reference is needed. No other endpoint requires configuration
  beyond `PORT`, which Azure sets automatically.
- CORS is currently open (`cors()` with no options) to keep local/frontend integration
  unblocked during early development. Restrict allowed origins before this reaches a
  shared or production environment.
