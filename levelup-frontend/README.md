# LevelUP Frontend

LevelUP is a competency and career development platform for **Sopra Steria** consultants.
This repository contains the complete frontend — a modern, enterprise-grade React + TypeScript
single-page application that lets consultants understand where they are today and what they
need to reach the next career level.

> **Frontend only.** This app consumes the deployed LevelUp backend API (`backend/`, an
> Express service on Azure App Service — see `docs/CHANGELOG.md`) for Profile,
> Certifications, Competencies, Career Path and Learning Plan. The backend itself is still
> mock-data-backed internally; no database or Azure AI/data services are implemented yet.
> A few purely-local interactions (Add certification, marking a certification/milestone
> complete, the AI Assistant chat) have no backend write endpoint and remain frontend-only —
> see "API integration" below.

## Tech stack

- **React 19** + **TypeScript** — component-based UI with strict typing
- **Vite** — fast dev server and production builds
- **React Router 7** — client-side routing for the six main pages
- **CSS custom properties** — a full design-token system (colors, spacing, radii, shadows)
- **Inline SVG icon set** — zero-icon-dependency, lightweight and themeable

## Running

```bash
npm install
cp .env.example .env.local   # set VITE_API_BASE_URL — see "API integration" below
npm run dev      # start the development server
npm run build    # typecheck + production build
npm run preview  # preview the production build
npm run lint     # static analysis (oxlint)
```

## API integration

The app talks to the LevelUp backend (`backend/`) over plain `fetch`, via a small typed
client layer under `src/api/`:

```
src/api/
├── client.ts         # apiGet<T>(): fetch + timeout + `{ data: T }` envelope unwrapping + ApiError
├── useApiResource.ts # useApiResource(fetcher) hook: { data, loading, error, retry }
├── profile.ts         → GET /api/profile
├── certifications.ts  → GET /api/certifications
├── competencies.ts    → GET /api/competencies
├── careerLevels.ts     → GET /api/career-levels
└── learningPlan.ts     → GET /api/learning-plan
```

- **Base URL** comes from the Vite env var `VITE_API_BASE_URL` (see `.env.example`), so the
  Azure hostname is never hard-coded in components. Falls back to `http://localhost:4000`
  (the local `backend/` dev server) when unset.
- **Loading / error / retry** — every page that fetches data wraps its content in the shared
  `<ApiState>` component (`src/components/ApiState.tsx`), which shows a spinner while
  loading and a friendly message + "Retry" button on failure (network error, timeout, or a
  non-2xx response) instead of crashing or showing a blank page.
- **Local-only interactions** — there is no backend write endpoint yet, so these remain
  frontend-only, seeded from the API response and then mutated in local component state:
  "Add certification" and the "Start tracking" / "Mark completed" status buttons on
  Certifications, the milestone/study-task checkboxes on Learning Plan, and the AI
  Assistant chat (canned replies, no backend call).
- **Types** — API responses are typed against the existing domain types in `src/types/index.ts`
  (`Certification`, `CareerLevel`, `CompetencyEntry`, etc., plus the new `Profile` and
  `LearningPlanData`); `client.ts` adds the `{ data: T }` response-envelope type on top,
  it doesn't duplicate the domain model.
- **CORS** — the backend currently allows all origins (`cors()` with no restriction), so no
  special handling is needed for the deployed Static Web App to reach it.

## Pages

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | **Dashboard** | Career overview: next-level progress, stat cards, recommended actions, competency snapshot, AI recommendation, milestones |
| `/certifications` | **Certifications** | Track/add certifications, filter by status/category, view required vs recommended certifications |
| `/competencies` | **Competency Development** | Self-assess across the five competency areas (Sales, Delivery, Manage, Entrepreneurship, Develop) with a radar chart |
| `/career` | **Career Path** | Career roadmap, current level, requirements for next level, missing requirements and progress indicators |
| `/learning` | **Learning Plan** | Development goals with milestones and an active study plan |
| `/assistant` | **AI Assistant** | Chat interface that answers career questions, recommends certifications, finds gaps and generates study plans |
| `/profile` | **Profile** | Identity, current level, completed certifications, active plans, competency overview, language preference |

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
├── App.tsx             # App shell: routes + responsive layout
├── vite-env.d.ts       # Typed `import.meta.env` (VITE_API_BASE_URL)
├── index.css           # Design tokens (CSS custom properties) + reset
├── types/index.ts      # Shared TypeScript domain types
├── data/mock.ts        # Fallback mock data for content with no backend contract yet
├── api/                # Typed API client — see "API integration" above
├── components/
│   ├── Icon.tsx        # Inline SVG icon system
│   ├── ui.tsx          # Reusable primitives: Card, CardHead, Badge, ProgressBar,
│   │                   #   StatCard, Button, LevelDots, PageHead
│   ├── ApiState.tsx    # Shared loading / error+retry wrapper for API-backed content
│   ├── Sidebar.tsx     # Navigation shell (responsive drawer)
│   ├── Topbar.tsx      # Sticky header with actions
│   └── app.css         # Shared component + page styles
└── pages/
    ├── Dashboard.tsx
    ├── Certifications.tsx
    ├── Competencies.tsx  # includes the SVG radar chart
    ├── CareerPath.tsx
    ├── LearningPlan.tsx
    ├── Profile.tsx
    └── AiAssistant.tsx   # interactive chat simulation (local-only, no backend call)
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

- **Data source** — Profile, Certifications, Competencies, Career Path and Learning Plan
  are fetched from the real backend (see "API integration" above). Everything is still
  typed against `src/types/index.ts`; `src/data/mock.ts` is now only a fallback/reference
  for content that has no backend contract yet (e.g. `dashboardStats`, `recommendedActions`)
  and is no longer imported by the wired pages.
- **AI Assistant** — the chat is a self-contained simulation with canned, context-aware
  replies (keyword-based `getReply`). It demos the full UX (suggestion chips, typing
  indicator, markdown-ish bold rendering) and is ready to be backed by a real model later;
  it does not call the backend.
- **Interactions** that would require a backend write (Add certification, marking a
  certification in-progress/completed, New goal, milestone/study-task checkboxes, Update
  self-assessment) are local-only: they mutate in-memory component state seeded from the
  API response, since no write endpoints exist on the backend yet.
