const sql = require('mssql');

/**
 * Azure SQL connection pool, authenticated via passwordless Azure AD auth
 * (`azure-active-directory-default`).
 *
 * In Azure, `DefaultAzureCredential` (used internally by the `tedious`
 * driver for this auth type) resolves the App Service's system-assigned
 * Managed Identity automatically — no connection secret is configured or
 * stored anywhere. For local development it falls back through the usual
 * `DefaultAzureCredential` chain (e.g. `az login`), provided the developer's
 * AAD account has also been granted access to the database.
 *
 * `SQL_SERVER` / `SQL_DATABASE` are plain (non-secret) App Service
 * Application Settings — see backend/README.md.
 */
const config = {
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: { encrypt: true },
  authentication: { type: 'azure-active-directory-default' },
};

let poolPromise;

/**
 * Lazily creates (once) and returns a shared connection pool promise.
 * Repositories should `await getPool()` before issuing a request.
 */
function getPool() {
  if (!poolPromise) {
    poolPromise = sql.connect(config);
  }
  return poolPromise;
}

module.exports = { getPool, sql };
