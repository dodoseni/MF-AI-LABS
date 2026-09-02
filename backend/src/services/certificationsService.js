const certificationsRepository = require('../repositories/certificationsRepository');

/**
 * Business logic for certifications. Today this is a pass-through to the
 * repository; this is where filtering/sorting rules would live if the API
 * grows beyond "return everything".
 */
async function listCertifications() {
  return certificationsRepository.findAll();
}

module.exports = { listCertifications };
