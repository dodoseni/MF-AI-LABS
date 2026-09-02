const projectsRepository = require('../repositories/projectsRepository');

/**
 * Business logic for the Projects smoke-test resource (MIKK-38). Validation
 * lives here so the repository stays a thin data-access layer.
 */
async function createProject(name) {
  const trimmed = typeof name === 'string' ? name.trim() : '';
  if (!trimmed) {
    const err = new Error('"name" is required and must be a non-empty string');
    err.status = 400;
    throw err;
  }

  return projectsRepository.create(trimmed);
}

async function listProjects() {
  return projectsRepository.findAll();
}

module.exports = { createProject, listProjects };
