const learningPlanRepository = require('../repositories/learningPlanRepository');

/**
 * Business logic for the learning plan. Returns the `StudyChecklist[]`
 * resource (one per-certification study checklist) directly from the
 * repository — no aggregation needed since MIKK-46 (see MIKK-37 for the
 * frontend model this mirrors).
 */
async function getLearningPlan() {
  return learningPlanRepository.findAll();
}

module.exports = { getLearningPlan };
