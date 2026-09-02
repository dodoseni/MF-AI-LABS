// Mock data for the LevelUp user profile.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`currentUser`) so the API contract
// matches the existing UI. This module is intentionally the ONLY place that knows
// the data is hardcoded — repositories/services/controllers above it never see
// this file directly.

const profile = {
  id: 'amalie-berg',
  name: 'Amalie Berg',
  email: 'amalie.berg@soprasteria.com',
  role: 'Senior Consultant',
  level: 'Senior Consultant',
  nextLevel: 'Principal Consultant',
  office: 'Oslo',
  memberSince: '2019',
  avatarInitials: 'AB',
};

module.exports = { profile };
