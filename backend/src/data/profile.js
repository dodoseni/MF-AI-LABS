// Mock data for the LevelUp user profile.
//
// Mirrors `levelup-frontend/src/data/mock.ts` (`currentUser`) so the API contract
// matches the existing UI. This module is intentionally the ONLY place that knows
// the data is hardcoded — repositories/services/controllers above it never see
// this file directly.
//
// As of MIKK-28 (merged into develop), `level`/`nextLevel` use the Level 1-4
// roadmap ('Level 3' / 'Level 4') instead of consulting titles. `role` is
// kept as a free-text job title (from `currentUser.role` in the frontend
// mock) — it is no longer the same value as `level`.

const profile = {
  id: 'amalie-berg',
  name: 'Amalie Berg',
  email: 'amalie.berg@soprasteria.com',
  role: 'Cloud Solutions Consultant',
  level: 'Level 3',
  nextLevel: 'Level 4',
  office: 'Oslo',
  memberSince: '2019',
  avatarInitials: 'AB',
};

module.exports = { profile };
