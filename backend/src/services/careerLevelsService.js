const careerLevelsRepository = require('../repositories/careerLevelsRepository');

/**
 * Business logic for career levels / career path. Today this is a
 * pass-through to the repository; the repository is responsible for
 * returning levels in career-progression order.
 */
async function listCareerLevels() {
  return careerLevelsRepository.findAll();
}

module.exports = { listCareerLevels };
