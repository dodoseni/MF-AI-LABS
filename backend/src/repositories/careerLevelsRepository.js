const { careerLevels } = require('../data/careerLevels');

/**
 * Repository layer for career levels / career path.
 *
 * Backed by local mock data today. A future Azure SQL-backed implementation
 * only needs to keep this same shape (`findAll(): Promise<CareerLevel[]>`),
 * returned in career-progression order — routes, controllers and services
 * never need to change.
 */
async function findAll() {
  return careerLevels;
}

module.exports = { findAll };
