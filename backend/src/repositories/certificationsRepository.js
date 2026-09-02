const { certifications } = require('../data/certifications');

/**
 * Repository layer for certifications.
 *
 * Backed by local mock data today. A future Azure SQL-backed implementation
 * only needs to keep this same shape (`findAll(): Promise<Certification[]>`)
 * — routes, controllers and services never need to change.
 */
async function findAll() {
  return certifications;
}

module.exports = { findAll };
