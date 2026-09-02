const competenciesService = require('../services/competenciesService');

// GET /api/competencies
async function listCompetencies(req, res, next) {
  try {
    const competencies = await competenciesService.listCompetencies();
    res.status(200).json({ data: competencies });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCompetencies };
