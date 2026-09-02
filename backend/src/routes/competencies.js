const express = require("express");
const { repository } = require("../data");
const { toCsv } = require("../services/csvService");

const router = express.Router();

// GET /api/competencies?userId=usr-amalie-berg
router.get("/", (req, res) => {
  const data = repository.getCompetenciesForUser(req.query.userId);
  res.json(data);
});

// GET /api/competencies/export.csv?userId=usr-amalie-berg
router.get("/export.csv", (req, res) => {
  const data = repository.getCompetenciesForUser(req.query.userId);
  const columns = ["area", "label", "current", "target", "previous", "gap"];
  const csv = toCsv(columns, data.areas);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="competencies-${data.userId}.csv"`
  );
  res.send(csv);
});

module.exports = router;
