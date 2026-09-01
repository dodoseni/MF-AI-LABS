const sql = require("mssql");
const config = require("../config");

let pool = null;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(config.database);
  }
  return pool;
}

async function healthCheck() {
  try {
    await getPool();
    return { connected: true };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

async function close() {
  if (pool) {
    await pool.close();
    pool = null;
  }
}

module.exports = { getPool, healthCheck, close };
