const express = require("express");
const { repository } = require("../data");
const { toCsv } = require("../services/csvService");
const { generateCertificatePdf } = require("../services/pdfService");

const router = express.Router();

// GET /api/certifications?userId=usr-amalie-berg
router.get("/", (req, res) => {
  const data = repository.getCertificationsForUser(req.query.userId);
  res.json(data);
});

// GET /api/certifications/export.csv?userId=usr-amalie-berg
router.get("/export.csv", (req, res) => {
  const data = repository.getCertificationsForUser(req.query.userId);
  const columns = [
    "id",
    "name",
    "issuer",
    "category",
    "level",
    "status",
    "earnedDate",
    "progress",
    "requiredFor",
    "description",
  ];
  const rows = data.certifications.map((c) => ({
    ...c,
    progress: c.progress ?? "",
    earnedDate: c.earnedDate ?? "",
    requiredFor: c.requiredFor.join("; "),
  }));
  const csv = toCsv(columns, rows);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="certifications-${data.userId}.csv"`
  );
  res.send(csv);
});

// GET /api/certifications/:id/certificate.pdf?userId=usr-amalie-berg
router.get("/:id/certificate.pdf", async (req, res, next) => {
  try {
    const { user, certification } = repository.getCertificationForUser(
      req.query.userId,
      req.params.id
    );

    if (certification.status !== "completed") {
      const err = new Error(
        `Certificate not available: '${certification.id}' is not completed for this user (status: ${certification.status})`
      );
      err.status = 409;
      throw err;
    }

    const pdfBuffer = await generateCertificatePdf({
      userName: user.userName,
      certificationName: certification.name,
      issuer: certification.issuer,
      earnedDate: certification.earnedDate,
      level: certification.level,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="certificate-${certification.id}.pdf"`
    );
    res.send(pdfBuffer);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
