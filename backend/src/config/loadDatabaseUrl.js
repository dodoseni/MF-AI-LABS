const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

/**
 * Runtime secret retrieval for `DATABASE_URL` (MIKK-56, Phase 3).
 *
 * At process startup — before any Prisma client is constructed anywhere in
 * the app (see `src/server.js`) — this fetches the `SqlConnectionString2`
 * secret from Azure Key Vault and sets `process.env.DATABASE_URL` in-memory
 * for this process only. The value is never written to a file, never
 * logged, and never returned to the caller; callers only observe
 * success/failure via a thrown error or the resolved env var being set.
 *
 * The Key Vault reference comes entirely from configuration
 * (`AZURE_KEY_VAULT_URL`), never a hardcoded vault name/URL in code, per the
 * secret-handling requirements in MIKK-56.
 */

const SECRET_NAME = 'SqlConnectionString2';

// The stored secret uses a postgres/JDBC-hybrid shape:
//   sqlserver://<user>:<password>@<host>:<port>?database=<db>&encrypt=<bool>&trustServerCertificate=<bool>
// Prisma's `sqlserver` connector does NOT accept that shape — it requires the
// semicolon-delimited SQL Server connection string form:
//   sqlserver://<host>:<port>;database=<db>;user=<user>;password=<password>;encrypt=<bool>;trustServerCertificate=<bool>
// This regex + reserialization performs a purely mechanical re-formatting of
// the exact same components (verified against the real secret's structure —
// not a guess at an unconfirmed format like ADO.NET). It never logs any of
// the captured groups.
const RAW_SECRET_SHAPE =
  /^sqlserver:\/\/([^:@]+):([^@]+)@([^:/?]+):(\d+)\?(.*)$/;

/**
 * Converts the Key Vault secret's connection-string shape into the shape
 * Prisma's `sqlserver` connector actually requires. Returns the input
 * unchanged if it doesn't match the known raw shape (e.g. it's already in
 * Prisma's semicolon form).
 */
function toPrismaConnectionString(rawUrl) {
  const match = rawUrl.match(RAW_SECRET_SHAPE);
  if (!match) {
    return rawUrl;
  }

  const [, user, password, host, port, queryString] = match;
  const params = new URLSearchParams(queryString);
  const database = params.get('database');
  const encrypt = params.get('encrypt') || 'true';
  const trustServerCertificate = params.get('trustServerCertificate') || 'false';

  return `sqlserver://${host}:${port};database=${database};user=${user};password=${password};encrypt=${encrypt};trustServerCertificate=${trustServerCertificate}`;
}

async function loadDatabaseUrl() {
  const vaultUrl = process.env.AZURE_KEY_VAULT_URL;

  if (!vaultUrl) {
    throw new Error(
      'AZURE_KEY_VAULT_URL is not set — cannot resolve DATABASE_URL from Key Vault.'
    );
  }

  const credential = new DefaultAzureCredential();
  const client = new SecretClient(vaultUrl, credential);

  // Intentionally never log/print `secret` or `secret.value` anywhere below.
  const secret = await client.getSecret(SECRET_NAME);

  if (!secret || !secret.value) {
    throw new Error(`Key Vault secret "${SECRET_NAME}" was empty or not found.`);
  }

  process.env.DATABASE_URL = toPrismaConnectionString(secret.value);
}

module.exports = loadDatabaseUrl;
module.exports.toPrismaConnectionString = toPrismaConnectionString;
