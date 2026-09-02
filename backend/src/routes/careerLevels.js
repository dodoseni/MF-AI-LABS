const express = require('express');

const careerLevelsController = require('../controllers/careerLevelsController');

const router = express.Router();

router.get('/career-levels', careerLevelsController.listCareerLevels);

module.exports = router;
