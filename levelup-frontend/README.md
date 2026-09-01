# LevelUP Frontend

LevelUP is a competency and career development platform for **Sopra Steria** consultants.
This repository contains the complete frontend — a modern, enterprise-grade React + TypeScript
single-page application that lets consultants understand where they are today and what they
need to reach the next career level.

> **Frontend only.** All data is mocked locally. No backend, database or Azure services are
> implemented — swap the `src/data/mock.ts` source for a real API when available.

## Tech stack

- **React 19** + **TypeScript** — component-based UI with strict typing
- **Vite** — fast dev server and production builds
- **React Router 7** — client-side routing for the six main pages
- **CSS custom properties** — a full design-token system (colors, spacing, radii, shadows)
- **Inline SVG icon set** — zero-icon-dependency, lightweight and themeable

## Running

```bash
npm install
npm run dev      # start the development server
npm run build    # typecheck + production build
npm run preview  # preview the production build
npm run lint     # static analysis (oxlint)
```

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
├── App.tsx             # App shell: routes + responsive layout
├── index.css           # Design tokens (CSS custom properties) + reset
├── types/index.ts      # Shared TypeScript domain types
├── data/mock.ts        # Mock user, certifications, competencies, career, goals, chat
├── components/
│   ├── Icon.tsx        # Inline SVG icon system
│   ├── ui.tsx          # Reusable primitives: Card, CardHead, Badge, ProgressBar,
│   │                   #   StatCard, Button, LevelDots, PageHead
│   ├── Sidebar.tsx     # Navigation shell (responsive drawer)
│   ├── Topbar.tsx      # Sticky header with actions
│   └── app.css         # Shared component + page styles
└── pages/
    ├── Dashboard.tsx
    ├── Certifications.tsx
    ├── Competencies.tsx  # includes the SVG radar chart
    ├── CareerPath.tsx
    ├── LearningPlan.tsx
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

- **Mock data** — everything is typed against `src/types/index.ts` and sourced from
  `src/data/mock.ts`, so wiring real backend calls only requires replacing that module.
- **AI Assistant** — the chat is a self-contained simulation with canned, context-aware
  replies (keyword-based `getReply`). It demos the full UX (suggestion chips, typing
  indicator, markdown-ish bold rendering) and is ready to be backed by a real model later.
- **Interactions** that would require persistence (Add certification, New goal, Update
  self-assessment, editing a plan) are mocked with buttons that open/notify; they are the
  intended integration surface for future backend work.
