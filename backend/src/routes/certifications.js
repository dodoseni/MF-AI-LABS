const express = require('express');

const certificationsController = require('../controllers/certificationsController');

const router = express.Router();

router.get('/certifications', certificationsController.listCertifications);

module.exports = router;
