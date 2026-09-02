const express = require("express");
const { repository } = require("../data");

const router = express.Router();

// GET /api/career/levels?userId=usr-amalie-berg
router.get("/levels", (req, res) => {
  const data = repository.getCareerLevelsForUser(req.query.userId);
  res.json(data);
});

module.exports = router;
