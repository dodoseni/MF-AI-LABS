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

## Database (Prisma + Azure SQL)

**Status: Phase 3 (MIKK-56) — DONE. Live against the real Azure SQL database.** Prisma is
installed and configured (Phase 1/MIKK-51), the `DatabaseSmokeTest` model +
`GET /api/db-test` exist (Phase 2/MIKK-53) and are now fully wired to the real database,
and `DATABASE_URL` is resolved automatically at startup from the real Azure Key Vault
secret (Phase 3/MIKK-56, this section). `Certification`, `CareerLevel`, `Profile`, and
`learning-plan` are still untouched and still read from `src/data/`.

- `prisma/schema.prisma` — `datasource db` is `provider = "sqlserver"`,
  `url = env("DATABASE_URL")`. `generator client` uses the standard `prisma-client-js`
  generator — no custom output path or driver adapter.
- Auth mode is **SQL Authentication** (username/password in the connection string), not
  Managed Identity for the *database* — no `@prisma/adapter-mssql` or driver-adapter
  package is used. (A VM **Managed Identity** *is* used, but only to authenticate to
  **Key Vault** for secret retrieval — see below.)

### How `DATABASE_URL` is obtained (open question 1 — now answered)

The runtime is a **self-hosted Azure VM** with a system-assigned Managed Identity. At
process startup, `src/config/loadDatabaseUrl.js` runs (from `src/server.js`, before `./app`
— and therefore before any Prisma client — is required):

1. Reads the Key Vault URI from the `AZURE_KEY_VAULT_URL` env var (never hardcoded in code
   — see `.env.example`). Confirmed value: `https://hemmelig-safe.vault.azure.net/`
   (vault name **Hemmelig-safe**).
2. Uses `@azure/identity`'s `DefaultAzureCredential` (picks up the VM's Managed Identity via
   IMDS — no client secret/certificate needed) and `@azure/keyvault-secrets`' `SecretClient`
   to fetch the **`SqlConnectionString2`** secret by name.
3. Sets `process.env.DATABASE_URL` in-memory for the running process only — never written
   to a file, never logged. If this step fails (e.g. `AZURE_KEY_VAULT_URL` unset, network
   unreachable, secret missing), the failure is logged as a generic message only (no
   connection-string content) and **the server still starts** — `GET /api/db-test` reports
   the resulting connection failure per-request instead of the whole process crashing.
4. If `DATABASE_URL` is already set (e.g. local `.env`), the Key Vault fetch is skipped
   entirely — useful for local development against a reachable SQL Server.

If `DATABASE_URL` needs to be set manually instead (e.g. local dev), see `.env.example`.

### Secret format (open question 2 — now answered, and it was neither of the two candidates)

The real `SqlConnectionString2` secret is **not** Prisma/JDBC-style, and **not**
ADO.NET-style either — it's a third, postgres-URL-like shape:

```
sqlserver://<user>:<password>@<host>:<port>?database=<db>&encrypt=<bool>&trustServerCertificate=<bool>
```

Prisma's `sqlserver` connector rejects this shape outright (`P1012`/parse error — `@` and
`?query` syntax isn't valid for its connection-string grammar). `loadDatabaseUrl.js`
performs a small, explicit, isolated re-serialization (`toPrismaConnectionString`, in the
same file, unit-testable, never logs its input/output) into the shape Prisma actually
requires:

```
sqlserver://<host>:<port>;database=<db>;user=<user>;password=<password>;encrypt=<bool>;trustServerCertificate=<bool>
```

This is a mechanical re-formatting of the same components (verified against the real
secret's structure), not a guess at an unconfirmed format.

### Resolved issue — credential correction + a database-name mismatch, both now fixed

The credential in `SqlConnectionString2` was corrected by the secret owner after an initial
`P1000` authentication failure (see `docs/CHANGELOG.md` for that earlier finding). After the
correction, authentication succeeded, but a **second, distinct issue** surfaced: the
secret's `database=mikkelrev` parameter didn't match any existing database — direct
inspection of `sys.databases` on the server showed only `master` and a differently-spelled
`mikelrev` (single "k") were visible to that login. This was **not** worked around by
silently redirecting the app to `mikelrev` — the app always uses whatever database name
`SqlConnectionString2` specifies, unmodified. Instead, running the real
`npx prisma migrate deploy` against the secret's actual value caused Azure SQL to
**auto-create** the `mikkelrev` (double "k") database — the SQL login has `CREATE DATABASE`
rights on the server — and the migration applied cleanly to that new, empty database. Both
`mikelrev` and `mikkelrev` now exist as separate databases on the server; the app only ever
talks to `mikkelrev`, matching the secret. Whether `mikelrev` was an earlier typo/leftover is
outside this issue's scope to resolve — flagged as a risk below.

### Migration strategy

- **`prisma migrate dev`** — for authoring and applying migrations against a reachable
  dev/test database during local development.
- **`prisma migrate deploy`** — applies already-committed migrations, no schema diffing.
  **Successfully run for real** against the live-resolved `DATABASE_URL`; see the real
  output in `docs/CHANGELOG.md` (MIKK-56 entry) — `SQL Server database created` (auto-create,
  see above) followed by `All migrations have been successfully applied`. Re-running is
  idempotent (`No pending migrations to apply`).
- **Where `prisma migrate deploy` runs in an ongoing deployment pipeline is still
  unresolved** — this issue ran it manually from the VM; no CI/CD step invokes it yet
  (`.github/workflows/levelup-api-dev.yml` still doesn't run any Prisma command).
- The `add_database_smoke_test` migration (Phase 2/MIKK-53) is **now applied to the real
  Azure SQL database** (`mikkelrev`) — `DatabaseSmokeTest`, `_prisma_migrations`, and the
  Azure-managed `database_firewall_rules` are the only tables present.

## Project structure

```
backend/
  src/
    app.js               # Express app: middleware, routes, error handling
    server.js             # HTTP server bootstrap (PORT binding, resolves DATABASE_URL first)
    config/
      loadDatabaseUrl.js   # Fetches SqlConnectionString2 from Key Vault via
                           #   DefaultAzureCredential; reformats to Prisma's
                           #   connection-string shape; never logs secret values
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
- **Fully validated end-to-end running on a self-hosted Azure VM** (Phase 3/MIKK-56): the
  VM's Managed Identity retrieves `SqlConnectionString2` from Key Vault, the server starts
  with `DATABASE_URL` resolved, `prisma migrate deploy` applies cleanly against the real
  Azure SQL database, and `GET /api/db-test` returns a real, persisted, incrementing record.
  **Still unconfirmed** whether the Azure App Service resource (`levelup-api-dev`) is also a
  real target — if it is, it would need either the same `AZURE_KEY_VAULT_URL` env var + a
  system-assigned Managed Identity granted `get`/`list` on the vault, or a native App
  Service **Key Vault reference** in Application Settings instead (which would bypass
  `loadDatabaseUrl.js` entirely, since App Service injects the resolved value directly as
  `DATABASE_URL`) — not decided here.
- The runtime identity (however `DefaultAzureCredential` resolves it — VM Managed Identity
  confirmed working here) needs `get`/`list` secret permission on the `Hemmelig-safe` Key
  Vault, and outbound network access to `*.vault.azure.net` and
  `mikkelrev.database.windows.net:1433`. Both are confirmed working from the VM used in
  this issue.
- CORS is currently open (`cors()` with no options) to keep local/frontend integration
  unblocked during early development. Restrict allowed origins before this reaches a
  shared or production environment.
