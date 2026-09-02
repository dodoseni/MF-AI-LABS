const profileRepository = require('../repositories/profileRepository');

/**
 * Business logic for the user profile. Today this is a pass-through to the
 * repository; this is where profile-derived logic (e.g. computed stats)
 * would live if it grew beyond the raw record.
 */
async function getProfile() {
  return profileRepository.findCurrentProfile();
}

module.exports = { getProfile };
