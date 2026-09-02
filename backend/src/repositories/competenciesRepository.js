const { competencies } = require('../data/competencies');

/**
 * Repository layer for competencies.
 *
 * Backed by local mock data today. A future Azure SQL-backed implementation
 * only needs to keep this same shape (`findAll(): Promise<CompetencyEntry[]>`)
 * — routes, controllers and services never need to change.
 */
async function findAll() {
  return competencies;
}

module.exports = { findAll };
