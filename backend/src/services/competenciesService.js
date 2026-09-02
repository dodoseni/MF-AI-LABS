const competenciesRepository = require('../repositories/competenciesRepository');

/**
 * Business logic for competencies. Today this is a pass-through to the
 * repository.
 */
async function listCompetencies() {
  return competenciesRepository.findAll();
}

module.exports = { listCompetencies };
