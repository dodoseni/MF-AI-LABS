const dbTestService = require('../services/dbTestService');

// GET /api/db-test
async function checkDbConnection(req, res, next) {
  try {
    const result = await dbTestService.checkDatabaseConnection();
    const status = result.success ? 200 : 503;
    res.status(status).json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { checkDbConnection };
