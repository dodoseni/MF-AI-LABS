const { studyChecklists } = require('../data/learningPlan');

/**
 * Repository layer for the learning plan (per-certification study
 * checklists — MIKK-37/MIKK-46).
 *
 * Backed by local mock data today. A future Azure SQL-backed implementation
 * only needs to keep this same shape — `findAll()` resolves the same
 * `StudyChecklist[]` structure it does now — so routes, controllers and
 * services never need to change.
 */
async function findAll() {
  return studyChecklists;
}

module.exports = { findAll };
