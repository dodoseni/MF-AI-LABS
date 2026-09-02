const learningPlanService = require('../services/learningPlanService');

// GET /api/learning-plan
async function getLearningPlan(req, res, next) {
  try {
    const learningPlan = await learningPlanService.getLearningPlan();
    res.status(200).json({ data: learningPlan });
  } catch (err) {
    next(err);
  }
}

module.exports = { getLearningPlan };
