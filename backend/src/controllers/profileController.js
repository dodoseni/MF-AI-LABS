const profileService = require('../services/profileService');

// GET /api/profile
async function getProfile(req, res, next) {
  try {
    const profile = await profileService.getProfile();
    res.status(200).json({ data: profile });
  } catch (err) {
    next(err);
  }
}

module.exports = { getProfile };
