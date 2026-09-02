const certificationsService = require('../services/certificationsService');

// GET /api/certifications
async function listCertifications(req, res, next) {
  try {
    const certifications = await certificationsService.listCertifications();
    res.status(200).json({ data: certifications });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCertifications };
