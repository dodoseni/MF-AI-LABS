const { profile } = require('../data/profile');

/**
 * Repository layer for the user profile.
 *
 * Backed by local mock data today. Methods are async / Promise-based on
 * purpose: a future Azure SQL-backed implementation only needs to keep this
 * same shape (`findCurrentProfile(): Promise<Profile>`) — routes, controllers
 * and services never need to change.
 */
async function findCurrentProfile() {
  return profile;
}

module.exports = { findCurrentProfile };
