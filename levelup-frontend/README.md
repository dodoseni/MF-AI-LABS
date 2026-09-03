# LevelUP Frontend

LevelUP is a competency and career development platform for **Sopra Steria** consultants.
This repository contains the complete frontend — a modern, enterprise-grade React + TypeScript
single-page application that lets consultants understand where they are today and what they
need to reach the next career level.

> **Frontend, API-backed where available (MIKK-52).** Profile, certifications, career levels
> and the learning-plan checklist are seeded from the LevelUp backend API on load (see
> [API integration](#api-integration) below). There are no backend *write* endpoints yet, so
> every add/edit/delete/toggle interaction in the UI remains frontend-local (`useState`) after
> that initial load — see [Remaining local-only functionality](#remaining-local-only-functionality--mock-data).

## Tech stack

- **React 19** + **TypeScript** — component-based UI with strict typing
- **Vite** — fast dev server and production builds
- **React Router 7** — client-side routing for the six main pages
- **CSS custom properties** — a full design-token system (colors, spacing, radii, shadows)
- **Inline SVG icon set** — zero-icon-dependency, lightweight and themeable

## Running

```bash
npm install
cp .env.example .env.local   # set VITE_API_BASE_URL — see below
npm run dev      # start the development server
npm run build    # typecheck + production build
npm run preview  # preview the production build
npm run lint     # static analysis (oxlint)
```

## API integration

The frontend talks to the LevelUp backend API for its initial data. The base URL is read from
the `VITE_API_BASE_URL` environment variable (see `.env.example`) — no Azure hostname is
hardcoded anywhere in application code.

```bash
# .env.local (untracked)
VITE_API_BASE_URL=https://levelup-api-dev-dfgugzd7a0fvf4f7.swedencentral-01.azurewebsites.net
```

This value is a public API hostname, not a secret.

### API-backed resources

| Resource | Endpoint | Used by | Client |
| --- | --- | --- | --- |
| Profile | `GET /api/profile` | `Sidebar`, `Dashboard` (greeting), `Profile` page — via `ProfileContext` | `src/api/profile.ts` |
| Certifications | `GET /api/certifications` | `Certifications`, `Dashboard`, `CareerPath`, `Profile`, `LearningPlan` — via `CertificationsContext` | `src/api/certifications.ts` |
| Career levels | `GET /api/career-levels` | `Dashboard`, `CareerPath` — via `CertificationsContext` | `src/api/careerLevels.ts` |
| Learning plan | `GET /api/learning-plan` | `LearningPlan` page (local component state) | `src/api/learningPlan.ts` |

All four endpoints wrap their payload as `{ "data": T }`; `src/api/client.ts` exposes a single
generic `apiGet<T>(path)` helper that unwraps the envelope and throws a typed `ApiError` on
failure (network error, non-2xx, or invalid JSON). `GET /api/competencies` no longer exists on
the backend and is never called by the frontend (the Competency feature was removed in MIKK-36).

### Loading / error / fallback behaviour

Every API-backed resource follows the same pattern so the app is never blank, even if the
backend is completely unreachable:

1. State is **initialized with the local mock/fallback value** (`src/data/mock.ts`), so the UI
   renders immediately.
2. On mount, the real endpoint is fetched. On success, the fallback is replaced with live data.
3. On failure, the fallback stays in place and an inline `ApiNotice` banner (see
   `components/ui.tsx`) explains the resource couldn't be loaded, with a **Retry** button that
   re-runs the request.
4. A `loading` variant of the same banner is shown while the initial request is in flight.
5. For `CertificationsContext` and the Learning Plan page, an internal "has the user made a
   local edit yet" flag prevents a slow/late API response from ever clobbering something the
   user already added/changed locally.

This was verified by pointing `VITE_API_BASE_URL` at a non-existent host: every page (Dashboard,
Profile, Certifications, Career Path, Learning Plan) still rendered its full local/mock data
with a visible error + Retry banner, and zero console/page errors.

### CertificationsContext (unchanged ownership, new data source)

`context/CertificationsContext.tsx` is still the single shared source of truth for
certifications and derived career-path progress across Dashboard, Career Path, Certifications
and Profile — it was **not** deleted or bypassed. The only change is where its *initial* state
comes from: `GET /api/certifications` and `GET /api/career-levels` instead of `data/mock.ts`
directly. `addCertification` / `deleteCertification` / `updateCertificationStatus` are unchanged
and remain local-only (no backend write endpoints exist yet).

One integration detail worth knowing: `GET /api/career-levels` requirements don't include a
`certId` linking a requirement to a `Certification.id` (the frontend's own mock template always
had this field). `CertificationsContext.tsx` bridges this with a small `REQUIREMENT_CERT_LINKS`
label→certId map so live progress can still be derived from the certifications list — see the
comment above that constant for details and the open question filed for the backend team to add
`certId` to the contract directly.

### Remaining local-only functionality & mock data

Per the MIKK-52 scope (no backend write endpoints yet), these stay frontend-local:

- **Certifications**: add / delete / status change (`CertificationsContext`).
- **Learning Plan**: toggle / add / delete checklist item, create / delete a study plan
  (`pages/LearningPlan.tsx` component state).
- **Profile → Active learning plans card**: still reads `developmentGoals` from `data/mock.ts`
  (no corresponding backend endpoint or Learning Plan integration for this card — a pre-existing
  gap flagged during MIKK-37, unchanged by this issue).
- **AI Assistant** chat: fully mocked/simulated, no backend integration.
- **Language preference** (`i18n/`): local UI state, not part of the API contract.

`data/mock.ts` is kept (not deleted) for exactly this: local-only fallback values and the
content above that has no backend endpoint yet.

## Pages

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | **Dashboard** | Career overview: next-level progress, stat cards, recommended actions, competency snapshot, AI recommendation, milestones |
| `/certifications` | **Certifications** | Track/add certifications, filter by status/category, view required vs recommended certifications |
| `/competencies` | **Competency Development** | Self-assess across the five competency areas (Sales, Delivery, Manage, Entrepreneurship, Develop) with a radar chart |
| `/career` | **Career Path** | Career roadmap, current level, requirements for next level, missing requirements and progress indicators |
| `/learning` | **Learning Plan** | Development goals with milestones and an active study plan |
| `/assistant` | **AI Assistant** | Chat interface that answers career questions, recommends certifications, finds gaps and generates study plans |

## Design system

Design tokens live as CSS custom properties in `src/index.css`. Key decisions:

- **Palette** — Sopra Steria-inspired blue primary (`--brand-500–900`) with a violet accent
  for AI/brand moments, plus a controlled semantic set for status (success/warning/danger/info).
- **Dark sidebar** (`--sidebar-bg: #0f1b33`) anchors the navigation, giving a strong
  "portal" feel similar to Azure Portal / Microsoft Learn; the content area uses a soft
  light-gray canvas with white cards for contrast and hierarchy.
- **Component styling** in `src/components/app.css` uses semantic class names (`.card`,
  `.badge`, `.progress-bar`) so every page shares consistent spacing, radii and shadows.
- **Data visualizations** — progress bars, level dots, competency radar (SVG) and a
  career-roadmap tracker communicate progression at a glance.
- **Responsive & accessible** — the sidebar collapses to an off-canvas drawer on mobile,
  grids reflow to single columns, focus states are preserved, and decorative SVGs are
  `aria-hidden` with accessible labels where they convey meaning. `prefers-reduced-motion`
  is respected.

## Component architecture

```
src/
├── main.tsx            # Entry; mounts <BrowserRouter>
├── App.tsx             # App shell: routes + responsive layout + ProfileProvider/CertificationsProvider
├── vite-env.d.ts        # Typed `import.meta.env.VITE_API_BASE_URL`
├── index.css           # Design tokens (CSS custom properties) + reset
├── types/index.ts      # Shared TypeScript domain types (incl. `Profile`)
├── data/mock.ts        # Local fallback data: currentUser/certifications/careerPath seed the
│                       #   API-backed contexts before/if the real fetch resolves; goals/chat
│                       #   remain fully local (no backend endpoint)
├── api/                # Backend API client (MIKK-52)
│   ├── client.ts       #   generic `apiGet<T>()` + `ApiError`, reads VITE_API_BASE_URL
│   ├── profile.ts      #   GET /api/profile
│   ├── certifications.ts #   GET /api/certifications
│   ├── careerLevels.ts #   GET /api/career-levels
│   └── learningPlan.ts #   GET /api/learning-plan
├── context/
│   ├── ProfileContext.tsx        # Profile fetch + loading/error/fallback state
│   └── CertificationsContext.tsx # Certifications + career-levels fetch, local-only CRUD,
│                                 #   live derived career-path progress (unchanged ownership)
├── components/
│   ├── Icon.tsx        # Inline SVG icon system
│   ├── ui.tsx          # Reusable primitives: Card, CardHead, Badge, ProgressBar,
│   │                   #   StatCard, Button, LevelDots, PageHead, ApiNotice (loading/error banner)
│   ├── Sidebar.tsx     # Navigation shell (responsive drawer)
│   ├── Topbar.tsx      # Sticky header with actions
│   └── app.css         # Shared component + page styles
└── pages/
    ├── Dashboard.tsx
    ├── Certifications.tsx
    ├── CareerPath.tsx
    ├── LearningPlan.tsx
    ├── Profile.tsx
    └── AiAssistant.tsx   # interactive chat simulation
```

### Reusable components

- **`Card` / `CardHead`** — consistent panel chrome with optional title icon and
  "view all" link/action, used across every page.
- **`Badge`** — status/level pill with semantic tones (`success`, `info`, `amber`, `red`,
  `violet`, `gray`) and optional indicator dot; maps domain states (e.g. `completed`) to tones.
- **`ProgressBar` / `ProgressLabel`** — accessible progress indicators with optional
  semantic tone.
- **`StatCard`** — number + label + icon summary tile used for KPI dashboards.
- **`LevelDots`** — 5-segment competency-level indicator (current vs target).
- **`Button`** — primary/secondary/ghost variants with consistent sizing.
- **`PageHead`** — consistent page title, subtitle and header actions.

This layering keeps theme and layout decisions in one place, so adding a new page or
component is quick and stays visually consistent.

## Architecture & demo notes

- **API-backed data** — Profile, Certifications, Career Levels and the Learning Plan checklist
  are fetched from the backend on load (see [API integration](#api-integration)); every value is
  typed against `src/types/index.ts`. `src/data/mock.ts` remains as the immediate/fallback value
  for those resources plus content with no backend endpoint at all (development goals, chat).
- **AI Assistant** — the chat is a self-contained simulation with canned, context-aware
  replies (keyword-based `getReply`). It demos the full UX (suggestion chips, typing
  indicator, markdown-ish bold rendering) and is ready to be backed by a real model later.
- **Local-only interactions** — Add/delete certification, mark in-progress/completed, and every
  Learning Plan checklist interaction (toggle/add/delete item, create/delete plan) are
  session-only (`useState`), since the backend has no write endpoints yet. See
  [Remaining local-only functionality](#remaining-local-only-functionality--mock-data).
