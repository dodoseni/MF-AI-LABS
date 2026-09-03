const loadDatabaseUrl = require('./config/loadDatabaseUrl');

/**
 * Resolves `DATABASE_URL` from Azure Key Vault (if not already set, e.g. via
 * local `.env`) before `./app` — and therefore any Prisma client — is
 * required. Never logs the resolved value; only success/failure.
 */
async function resolveDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    // Already set (e.g. local development via `.env`) — skip Key Vault.
    return;
  }

  try {
    await loadDatabaseUrl();
    // eslint-disable-next-line no-console
    console.log('DATABASE_URL resolved from Key Vault.');
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to resolve DATABASE_URL from Key Vault:', err.message);
    // Do not throw: the server still starts so non-database endpoints keep
    // working, and GET /api/db-test reports the connection failure itself
    // rather than the whole process crashing at startup.
  }
}

async function start() {
  await resolveDatabaseUrl();

  // Required only after DATABASE_URL is resolved, so the Prisma client
  // (instantiated as soon as `./app`'s require chain reaches
  // `dbTestRepository.js`) picks up the real connection string.
  const createApp = require('./app');
  const app = createApp();

  // Azure App Service sets PORT; fall back to 4000 for local development.
  const PORT = process.env.PORT || 4000;

  // Bind to 0.0.0.0 so the server is reachable inside Azure App Service containers.
  app.listen(PORT, '0.0.0.0', () => {
    // eslint-disable-next-line no-console
    console.log(`LevelUp backend listening on port ${PORT}`);
  });
}

start();
