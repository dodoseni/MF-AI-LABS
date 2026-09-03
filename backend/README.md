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
| GET | `/api/profile` | The current mock user's profile (identity, `level`/`nextLevel` as `"Level N"`, office). | `{ "data": { ...profile } }` |
| GET | `/api/certifications` | All certifications (status, category, level, progress, `requiredFor: ["Level 1".."Level 3"]`, description). | `{ "data": [ ...certifications ] }` |
| GET | `/api/career-levels` | Career roadmap Level 1 → Level 4, in progression order, each with `requirementMode` (`all`/`choose`/`holistic`), `requirementNote`, `chooseAtLeast` (when `choose`), `requirements`, and `focusAreas` (when `holistic`). | `{ "data": [ ...careerLevels ] }` |
| GET | `/api/learning-plan` | The user's learning plan: a list of per-certification study checklists (`StudyChecklist[]`). | `{ "data": [ { "id", "certificationId", "certificationName", "items": [ { "id", "label", "done" } ] } ] }` |

**Career levels (`/api/career-levels`).** The roadmap is `Level 1` (Foundation) → `Level 2`
(Specialisation) → `Level 3` (Leadership track) → `Level 4` (Strategic impact), replacing the
former consulting-title roadmap (Consultant / Senior Consultant / Principal Consultant /
Enterprise Architect) as of MIKK-28. `requirementMode` describes how to read `requirements`:
`'all'` (hold every listed certification — Level 1), `'choose'` (hold at least
`chooseAtLeast` of the listed certifications — Level 2 and 3), or `'holistic'` (no fixed
certification list; see `focusAreas` instead — Level 4). `certifications[].requiredFor`
references these same `"Level 1"`.."Level 3"` values (Level 4 has no certification
requirements).

**Learning plan (`/api/learning-plan`).** Returns `StudyChecklist[]` — one todo-list
checklist per certification the user is actively studying for (`certificationId`,
`certificationName`, `items: { id, label, done }[]`), matching the Learning Plan page as of
MIKK-37. This replaced an earlier goals/tasks/weekly-plan/calendar contract that the frontend
no longer uses (removed MIKK-46). Adding/toggling/deleting checklists and items is currently
frontend-local state only (`useState`, no persistence) — this endpoint is read-only (`GET`);
write endpoints are not yet implemented on the backend.

**Data is temporary mock data.** Every response currently comes from static objects/arrays
in `src/data/`, wired through a repository layer (see below) rather than a database. This
lets the frontend build and stabilize against a real API contract before an actual Azure
SQL–backed implementation exists — swapping the repository layer is intended to be a
drop-in change with no impact on routes, controllers, or the public API shape.

## Database (Prisma + Azure SQL) — foundation only

**Status: Phase 1 foundation (MIKK-51).** Prisma is installed and configured to talk to
Azure SQL, but **no models exist yet and no repository/controller/route uses it** —
`Certification`, `CareerLevel`, `Profile`, and `learning-plan` all still read from
`src/data/` as described above. This section documents the environment/config and
migration strategy that a future issue will build product models on top of; it does not
change any runtime behavior today.

- `prisma/schema.prisma` — `datasource db` is `provider = "sqlserver"`,
  `url = env("DATABASE_URL")`. `generator client` uses the standard `prisma-client-js`
  generator (output to `node_modules/@prisma/client`, the Prisma default) — no custom
  output path or driver adapter.
- Auth mode is **SQL Authentication** (username/password in the connection string), not
  Managed Identity — no `@prisma/adapter-mssql` or other driver-adapter package is used or
  needed for this mode.

### Environment variable: `DATABASE_URL`

Documented (name only, no value) in `.env.example`. Copy it to `.env` (already
git-ignored) and set a real value to run anything that touches the database.

The value must be a **Prisma-format** (JDBC-style) SQL Server connection string, e.g.:

```
sqlserver://<host>:1433;database=<db>;user=<user>;password=<password>;encrypt=true
```

`encrypt=true` is **required** — Azure SQL only accepts TLS connections. Leave
`trustServerCertificate` at its default (`false`); Azure SQL presents a valid CA-signed
certificate, so there's no need to relax certificate validation.

The value is sourced from the `SqlConnectionString` secret in Azure Key Vault. **Two open
questions are deliberately left unresolved here** — do not treat either as decided:

1. **How the runtime environment obtains the secret value.** Two different backend
   deployment descriptions have circulated for this project: the only deployment
   mechanism that actually exists in this repo today is
   `.github/workflows/levelup-api-dev.yml`, which deploys to an **Azure App Service**
   (`levelup-api-dev`) via `azure/webapps-deploy@v3`; a separate planning conversation
   described the backend as running on a **self-hosted Azure VM** instead, which has no
   deployment configuration anywhere in this repo. This inspection cannot confirm which is
   correct, or whether both exist as parallel environments. Until that's resolved, how
   `DATABASE_URL` gets set at runtime is unknown — candidates include an Azure App
   Service **Key Vault reference** in Application Settings (native PaaS mechanism, no app
   code needed) if App Service is the real target, or a VM Managed Identity + SDK fetch at
   startup, a deploy-time script (`az keyvault secret show`), or manual/CI-injected
   environment variable if a VM is the real target. **No mechanism is implemented or
   assumed here.**
2. **Whether the stored `SqlConnectionString` secret is already in the Prisma/JDBC syntax
   shown above, or in ADO.NET style**
   (`Server=tcp:<host>,1433;Initial Catalog=<db>;User ID=<user>;Password=<password>;Encrypt=True;...`,
   the typical format the Azure Portal surfaces for SQL Database connection strings). This
   run has no access to inspect the real Key Vault secret, so **this cannot be confirmed
   from this runtime** — if it turns out to be ADO.NET-style, a small, explicit
   reformatting step (not a magic string transform buried in application code) will be
   needed before it can be used as `DATABASE_URL`.

Local development against a real/containerized SQL Server is not set up in this pass — out
of scope for Phase 1; flagged as a follow-up if local development against a real database
is ever needed.

### Migration strategy

- **`prisma migrate dev`** — for authoring and applying migrations against a reachable
  dev/test database during local development (creates a new migration file under
  `prisma/migrations/` and applies it).
- **`prisma migrate deploy`** — for applying already-committed migrations in a target
  environment (no schema diffing, just applies pending migration files). This is the
  command a deployment path would run against the real Azure SQL database.
- **Where `prisma migrate deploy` actually runs is unresolved**, for the same reason as
  open question 1 above: there is no existing CI/CD path in this repo that reaches a
  self-hosted VM, and the one CI/CD path that does exist
  (`.github/workflows/levelup-api-dev.yml`) does not currently run any Prisma command. This
  document does not invent a workflow step for a VM deployment path that isn't in the
  repo, nor assume the existing App Service workflow is the right place to add one — that
  decision depends on resolving the deployment-target question first. Until then, treat
  `prisma migrate deploy` as a manual step run by whoever has a resolved `DATABASE_URL`.
- No models exist yet, so no migration has been generated in this issue — see
  `prisma/README.md` for the current, no-migrations-yet state.

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
      careerLevels.js
      learningPlan.js
    controllers/           # req/res handling — call a service, shape the HTTP response
      profileController.js
      certificationsController.js
      careerLevelsController.js
      learningPlanController.js
    services/              # Business logic — currently pass-through to repositories
      profileService.js
      certificationsService.js
      careerLevelsService.js
      learningPlanService.js
    repositories/          # Data access — the ONLY layer that knows data is mocked.
      profileRepository.js         #   Promise-based on purpose: a future Azure SQL
      certificationsRepository.js  #   repository only needs to keep the same method
      careerLevelsRepository.js    #   names/shapes for routes/controllers/services to
      learningPlanRepository.js    #   keep working unchanged.
    data/                  # Local mock datasets, aligned with levelup-frontend/src/data/mock.ts
      profile.js
      certifications.js
      careerLevels.js
      learningPlan.js
  prisma/
    schema.prisma          # Azure SQL datasource + generator config only — no models yet
    README.md               # Migration command reference (see also the README section above)
  tests/
    health.test.js
    profile.test.js
    certifications.test.js
    careerLevels.test.js
    learningPlan.test.js
    notFound.test.js
  .env.example             # Documents DATABASE_URL by name only — no values, no secrets
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
- No route currently reads `DATABASE_URL` (Prisma is installed/configured but not wired
  into any repository yet — see "Database (Prisma + Azure SQL)" above), so nothing is
  broken today by `DATABASE_URL` being unset. Once a future issue starts using Prisma at
  runtime, `DATABASE_URL` will need to be set in whichever environment actually runs this
  app — **unconfirmed whether that's this App Service resource, a self-hosted VM, or
  both** (see the open questions above). No auth/AI secrets exist yet either.
- CORS is currently open (`cors()` with no options) to keep local/frontend integration
  unblocked during early development. Restrict allowed origins before this reaches a
  shared or production environment.
