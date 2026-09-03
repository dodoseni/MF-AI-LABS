const dbTestRepository = require('../repositories/dbTestRepository');

const SMOKE_TEST_MESSAGE = 'Database connection successful';

/**
 * Orchestrates the Azure SQL connectivity smoke test (MIKK-53):
 * connect -> create -> read-back -> structured result.
 *
 * Never throws: callers (the controller) always get back a plain result
 * object describing exactly what succeeded/failed, so `GET /api/db-test` can
 * report connectivity state instead of behaving like a normal product
 * endpoint that 500s on error.
 */
async function checkDatabaseConnection() {
  try {
    await dbTestRepository.connect();
  } catch (err) {
    return {
      success: false,
      databaseConnected: false,
      recordCreated: false,
      error: 'Unable to connect to the database',
      details: err.message,
    };
  }

  try {
    const created = await dbTestRepository.create(SMOKE_TEST_MESSAGE);
    const record = await dbTestRepository.findById(created.id);

    return {
      success: true,
      databaseConnected: true,
      recordCreated: true,
      record: { id: record.id, message: record.message },
    };
  } catch (err) {
    return {
      success: false,
      databaseConnected: true,
      recordCreated: false,
      error: 'Connected to the database, but failed to create/read the smoke test record',
      details: err.message,
    };
  }
}

module.exports = { checkDatabaseConnection };
