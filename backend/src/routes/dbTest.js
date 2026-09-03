const express = require('express');

const dbTestController = require('../controllers/dbTestController');

const router = express.Router();

router.get('/db-test', dbTestController.checkDbConnection);

module.exports = router;
