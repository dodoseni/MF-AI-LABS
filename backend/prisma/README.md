# Prisma (Azure SQL) — Phase 1 foundation

See `../README.md` ("Database (Prisma + Azure SQL) — foundation only") for the full
environment/config strategy and the open questions on secret sourcing and deployment
target. This file is a short command reference for working with `schema.prisma` day to
day.

**Current state:** `schema.prisma` has only a `datasource`/`generator` block — no models,
no migrations. This is intentional for this issue (MIKK-51, "Phase 1 — Prisma Foundation");
adding the first model/migration is separate follow-up work.

## Commands

| Command | Purpose | When to run it |
|---|---|---|
| `npx prisma validate` | Checks `schema.prisma` is syntactically/semantically valid. Requires a syntactically valid `DATABASE_URL` in the environment, but **does not** connect to a real database. | Any time, including CI, with a placeholder `DATABASE_URL`. |
| `npx prisma generate` | Generates the `@prisma/client` code for the models currently in `schema.prisma`. | After changing `schema.prisma`. Not required today since there are no models yet. |
| `npx prisma migrate dev --name <description>` | Authors a new migration by diffing `schema.prisma` against a **reachable dev/test database**, applies it, and regenerates the client. | Local development only, against a dev/test Azure SQL (or other reachable) instance — never against the production database. |
| `npx prisma migrate deploy` | Applies already-committed migrations from `prisma/migrations/` to a target database, without diffing/generating anything new. | In whichever environment actually runs deployments — **unresolved**, see below. |

## Open questions (not decided here)

- **Where `prisma migrate deploy` runs** — there's no existing CI/CD path in this repo
  that reaches a self-hosted VM, and the one CI/CD workflow that does exist
  (`.github/workflows/levelup-api-dev.yml`, Azure App Service) doesn't run any Prisma
  command today. Do not add a step to that workflow, or invent a VM deploy script, until
  the deployment-target question is resolved (see `../README.md`).
- **How `DATABASE_URL` is populated** in whichever environment actually runs migrations —
  same open question as runtime `DATABASE_URL` sourcing, see `../README.md`.

## Local validation without a real database

```bash
cd backend
DATABASE_URL="sqlserver://localhost:1433;database=placeholder;user=placeholder;password=placeholder;encrypt=true" npx prisma validate
```

This confirms the schema is well-formed without requiring (or attempting) a live
connection to any database, real or otherwise.
