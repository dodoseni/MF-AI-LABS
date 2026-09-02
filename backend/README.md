# LevelUp Backend

Minimal Express.js backend skeleton for the LevelUp platform. This is a clean, deployable
foundation only — it does not yet implement Azure SQL, authentication, AI/Foundry
integration, or product endpoints. Those will be built as separate, tracked follow-up work.

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

## Tests

```bash
npm test
```

Runs the Jest + Supertest suite, which verifies `GET /api/health` returns HTTP 200
with `{ "status": "ok" }`.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Liveness check. Returns `{ "status": "ok" }`. |

## Project structure

```
backend/
  src/
    app.js         # Express app: middleware, routes, error handling
    server.js       # HTTP server bootstrap (PORT binding)
    routes/
      health.js      # GET /api/health
  tests/
    health.test.js   # Supertest coverage for /api/health
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
