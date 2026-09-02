const express = require("express");
const { repository } = require("../data");

const router = express.Router();

// GET /api/manager/overview
router.get("/overview", (_req, res) => {
  const data = repository.getManagerOverview();
  res.json(data);
});

module.exports = router;
