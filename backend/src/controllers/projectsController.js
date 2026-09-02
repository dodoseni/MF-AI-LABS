const projectsService = require('../services/projectsService');

// POST /api/projects
async function createProject(req, res, next) {
  try {
    const project = await projectsService.createProject(req.body && req.body.name);
    res.status(201).json({ data: project });
  } catch (err) {
    next(err);
  }
}

// GET /api/projects
async function listProjects(req, res, next) {
  try {
    const projects = await projectsService.listProjects();
    res.status(200).json({ data: projects });
  } catch (err) {
    next(err);
  }
}

module.exports = { createProject, listProjects };
