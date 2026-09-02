const { getPool, sql } = require('../db/pool');

/**
 * Repository layer for the `dbo.Projects` smoke-test table (MIKK-38).
 *
 * Unlike the other repositories in this codebase (which are still mock-data
 * pass-throughs), this one is backed by the real Azure SQL database — it
 * exists to prove the Backend API -> Azure SQL connectivity chain via the
 * App Service's Managed Identity.
 */

/**
 * Inserts a new project row and returns the persisted record, including the
 * database-generated `Id` and `CreatedAt` (via the `OUTPUT` clause, so the
 * returned `createdAt` always matches the DEFAULT SYSUTCDATETIME() value SQL
 * Server actually stored — no separate round trip or app-side clock needed).
 */
async function create(name) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input('name', sql.NVarChar(200), name)
    .query(
      'INSERT INTO dbo.Projects (Name) OUTPUT INSERTED.Id, INSERTED.Name, INSERTED.CreatedAt VALUES (@name);'
    );

  const row = result.recordset[0];
  return { id: row.Id, name: row.Name, createdAt: row.CreatedAt };
}

/**
 * Returns all projects, most recently created first.
 */
async function findAll() {
  const pool = await getPool();
  const result = await pool
    .request()
    .query('SELECT Id, Name, CreatedAt FROM dbo.Projects ORDER BY CreatedAt DESC;');

  return result.recordset.map((row) => ({
    id: row.Id,
    name: row.Name,
    createdAt: row.CreatedAt,
  }));
}

module.exports = { create, findAll };
