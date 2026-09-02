const express = require('express');

const profileController = require('../controllers/profileController');

const router = express.Router();

router.get('/profile', profileController.getProfile);

module.exports = router;
