const express = require('express');

const competenciesController = require('../controllers/competenciesController');

const router = express.Router();

router.get('/competencies', competenciesController.listCompetencies);

module.exports = router;
