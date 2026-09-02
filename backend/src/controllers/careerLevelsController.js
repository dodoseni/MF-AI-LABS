const careerLevelsService = require('../services/careerLevelsService');

// GET /api/career-levels
async function listCareerLevels(req, res, next) {
  try {
    const careerLevels = await careerLevelsService.listCareerLevels();
    res.status(200).json({ data: careerLevels });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCareerLevels };
