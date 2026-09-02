const express = require("express");
const { repository } = require("../data");

const router = express.Router();

// GET /api/users — demo consultants available in the mock layer (no auth
// yet — MIKK-12). Frontend can use this to let a user pick who to view as.
router.get("/", (_req, res) => {
  res.json({ users: repository.listUsers() });
});

module.exports = router;
