const learningPlanRepository = require('../repositories/learningPlanRepository');

/**
 * Business logic for the learning plan. Combines development goals, study
 * tasks, the weekly plan and calendar events into the single learning-plan
 * resource the frontend page consumes.
 */
async function getLearningPlan() {
  const [goals, tasks, weeklyPlan, calendar] = await Promise.all([
    learningPlanRepository.findGoals(),
    learningPlanRepository.findTasks(),
    learningPlanRepository.findWeeklyPlan(),
    learningPlanRepository.findCalendarEvents(),
  ]);

  return { goals, tasks, weeklyPlan, calendar };
}

module.exports = { getLearningPlan };
