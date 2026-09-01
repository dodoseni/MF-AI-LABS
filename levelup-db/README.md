# LevelUp — Azure SQL data model

Data model for the LevelUp competency & career-development platform, implemented
for Azure SQL Database (T-SQL). This is the **MVP** model scoped to certification
overview, progress tracking and career-level visualization.

## Files

| File | Purpose |
|------|---------|
| `schema.sql` | Creates all tables (reference + user-owned). |
| `seed.sql`   | Seeds reference/catalog data (job-family levels, the 5 competency areas, certification catalog, certification matrix, competency requirements). |
| `views.sql`  | Example views for the three primary MVP reads (certifications, competency gap, career path). |

Apply in order in the target Azure SQL database:

```
sqlcmd -S <server>.database.windows.net -d <db> -i schema.sql
sqlcmd -S <server>.database.windows.net -d <db> -i seed.sql
sqlcmd -S <server>.database.windows.net -d <db> -i views.sql
```

All scripts are idempotent and safe to re-run.

## Entity overview

**Reference / catalog (non-sensitive):**

- `job_family_level` — the Job Family framework levels (`family_code`, `level_code`).
  MVP ships the `consultant` track but the schema supports other families.
- `competency_area` — the five fixed areas: **Sales, Delivery, Manage,
  Entrepreneurship, Develop** (codes stored uppercase).
- `certification` — mastered vendor certification catalog, with a `source_url`
  pointing back to Microsoft Learn / vendor pages.
- `certification_requirement` — the certification matrix: which certs are
  **required** (or recommended) for a given job-family level. Many certifications
  unlock multiple levels.
- `competency_requirement` — target self-assessment level (1–5) per area per
  job-family level.
- `career_level` — thin UI overlay (display name, role, colour, sort order) that
  drives career-path visualization while staying joined to `job_family_level`.

**User-owned / progression (sensitive employee data):**

- `app_user` — consultant profile; carries `owner_id`-style `user_id` +
  `tenant_id` for row-level access control, plus `current_family`/`current_level`.
- `user_certification` — a user's certification record (`completed`,
  `in-progress`, `missing`, `recommended`), with `earned_date`, `progress_pct`,
  and optional verification fields.
- `user_competency` — per-area self-assessment with `current/target/previous`
  levels and a `review_period_key` so history is preserved across assessment
  cycles; unique per (user, area, cycle).
- `user_career` — a user's place on the career path (current level, next level,
  progress %).
- `development_goal` + `goal_milestone` — goals and their milestones, powering
  progress tracking and the learning plan.
- `study_plan_item` — learning items (course / certification / reading /
  practice) referenced by the learning-plan and recommendations.

## Schema decisions

- **Sensitivity & access control.** User-owned tables all carry `user_id +
  tenant_id` (and soft-delete via `deleted_at`) so row-level security (RLS) and
  tenant isolation can be enforced without a migration. MVP uses a single
  tenant; the columns are modelled now to avoid churn later. `user_certification`
  has `verified_by`/`verified_at` placeholders for provenance of earned certs.
- **Natural keys over identity.** Catalog tables use stable human-readable keys
  (`az-305`, `Sales`, `principal`) matching the frontend mock ids, so the app and
  seed data stay in sync. Identity `BIGINT` is used only where there is no
  natural key (e.g. `user_certification` has a `UNIQUE (user_id,
  certification_id)` natural key plus a PK).
- **Extensibility.** `job_family_level` keys on `(family_code, level_code)` so
  new tracks (e.g. management) are additive. `review_period_key` on
  `user_competency` gives time-series history for trend visualization and gap
  analysis.
- **Bare-minimum, not overbuilt.** no lookup for `status` enums (checked
  constraints instead), no cross-tenant sharding, no audit triggers yet —
  `created_at`/`updated_at` columns are provided and the app is expected to set
  them.

## MVP queries supported

Answers driven by the views:

- Certification overview per user (`vw_user_certifications`) — the dashboard
  "8 / 12 certifications" count and per-cert status/progress.
- Competency gap analysis (`vw_user_competency_gap`) — `target − current` per
  area, which the AI Engineer can extend for career recommendations.
- Career-path visualization (`vw_user_career_path`) — current/next level and
  progress toward the next level.

## Open questions / risks

- **`user_certification` uniqueness by `(user_id, certification_id)`** prevents a
  user holding the same cert twice (e.g. renewal). If renewals are needed, relax
  this constraint or add a `attempt/cycle` dimension.
- **`source_document`** is raw free text for MVP; a structured document/link
  table may be needed once ingestion from PDFs/SharePoint/Learn is productized.
- **Access control** is modelled (tenant_id + soft delete) but RLS policies and
  the app's principal model are not yet implemented; coordinate with the backend
  before enabling RLS.
