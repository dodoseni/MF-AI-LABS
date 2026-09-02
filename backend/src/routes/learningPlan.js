const express = require('express');

const learningPlanController = require('../controllers/learningPlanController');

const router = express.Router();

router.get('/learning-plan', learningPlanController.getLearningPlan);

module.exports = router;
