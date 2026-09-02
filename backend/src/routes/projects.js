const express = require('express');

const projectsController = require('../controllers/projectsController');

const router = express.Router();

router.post('/projects', projectsController.createProject);
router.get('/projects', projectsController.listProjects);

module.exports = router;
