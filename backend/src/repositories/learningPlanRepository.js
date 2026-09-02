const { goals, tasks, weeklyPlan, calendar } = require('../data/learningPlan');

/**
 * Repository layer for the learning plan (goals, study tasks, weekly plan,
 * calendar).
 *
 * Backed by local mock data today. A future Azure SQL-backed implementation
 * only needs to keep this same shape — each method resolves the same data
 * structure it does now — so routes, controllers and services never need to
 * change.
 */
async function findGoals() {
  return goals;
}

async function findTasks() {
  return tasks;
}

async function findWeeklyPlan() {
  return weeklyPlan;
}

async function findCalendarEvents() {
  return calendar;
}

module.exports = { findGoals, findTasks, findWeeklyPlan, findCalendarEvents };
