const express = require("express");
const healthRouter = require("./health");
const certificationsRouter = require("./certifications");
const competenciesRouter = require("./competencies");
const careerRouter = require("./career");
const learningPlansRouter = require("./learningPlans");
const managerRouter = require("./manager");
const usersRouter = require("./users");

const router = express.Router();

router.use("/health", healthRouter);
router.use("/certifications", certificationsRouter);
router.use("/competencies", competenciesRouter);
router.use("/career", careerRouter);
router.use("/learning-plans", learningPlansRouter);
router.use("/manager", managerRouter);
router.use("/users", usersRouter);

module.exports = router;
