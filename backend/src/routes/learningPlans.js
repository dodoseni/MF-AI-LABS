const express = require("express");
const { repository } = require("../data");

const router = express.Router();

// GET /api/learning-plans?userId=usr-amalie-berg
router.get("/", (req, res) => {
  const data = repository.getLearningPlanForUser(req.query.userId);
  res.json(data);
});

module.exports = router;
