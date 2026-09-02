# LevelUp Backend

Express.js backend for the LevelUp platform. It exposes read-only REST API contracts for
the frontend, currently backed by **local mock data**. Authentication, Azure SQL, and
AI/Foundry integration are intentionally out of scope for this stage and will be built as
separate, tracked follow-up work.

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

All endpoints are read-only (`GET` only). Successful responses are `HTTP 200` JSON; list
endpoints wrap their payload as `{ "data": [...] }`, single-resource endpoints as
`{ "data": {...} }`. Unknown routes return `HTTP 404` with `{ "error": "Not Found" }`;
unexpected errors are handled by the centralized error handler in `src/app.js`.

| Method | Path | Description | Shape |
|---|---|---|---|
| GET | `/api/health` | Liveness check. | `{ "status": "ok" }` |
| GET | `/api/profile` | The current mock user's profile (identity, level, office). | `{ "data": { ...profile } }` |
| GET | `/api/certifications` | All certifications (status, category, level, progress, description). | `{ "data": [ ...certifications ] }` |
| GET | `/api/competencies` | The five competency areas (current/target/previous self-assessment levels). | `{ "data": [ ...competencies ] }` |
| GET | `/api/career-levels` | Career path levels in progression order, each with its requirements. | `{ "data": [ ...careerLevels ] }` |
| GET | `/api/learning-plan` | The user's learning plan: development goals (+ milestones), study tasks, weekly plan, calendar events. | `{ "data": { "goals": [...], "tasks": [...], "weeklyPlan": [...], "calendar": [...] } }` |

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
    routes/                # Express routers — map path -> controller, no logic
      health.js
      profile.js
      certifications.js
      competencies.js
      careerLevels.js
      learningPlan.js
    controllers/           # req/res handling — call a service, shape the HTTP response
      profileController.js
      certificationsController.js
      competenciesController.js
      careerLevelsController.js
      learningPlanController.js
    services/              # Business logic — currently pass-through to repositories
      profileService.js
      certificationsService.js
      competenciesService.js
      careerLevelsService.js
      learningPlanService.js
    repositories/          # Data access — the ONLY layer that knows data is mocked.
      profileRepository.js         #   Promise-based on purpose: a future Azure SQL
      certificationsRepository.js  #   repository only needs to keep the same method
      competenciesRepository.js    #   names/shapes for routes/controllers/services to
      careerLevelsRepository.js    #   keep working unchanged.
      learningPlanRepository.js
    data/                  # Local mock datasets, aligned with levelup-frontend/src/data/mock.ts
      profile.js
      certifications.js
      competencies.js
      careerLevels.js
      learningPlan.js
  tests/
    health.test.js
    profile.test.js
    certifications.test.js
    competencies.test.js
    careerLevels.test.js
    learningPlan.test.js
    notFound.test.js
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
- No secrets or environment-specific configuration exist yet (no database, no auth, no AI
  integration), so there is nothing to add to Application Settings beyond `PORT`, which
  Azure sets automatically.
- CORS is currently open (`cors()` with no options) to keep local/frontend integration
  unblocked during early development. Restrict allowed origins before this reaches a
  shared or production environment.
