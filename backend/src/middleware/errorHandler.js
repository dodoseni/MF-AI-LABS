function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  // Only log full stack traces for unexpected (5xx) errors; expected client
  // errors (404/409/etc.) are logged as a single line to keep noise down.
  if (status >= 500) {
    console.error(err.stack || err.message || err);
  } else {
    console.warn(`[${status}] ${err.message}`);
  }
  res.status(status).json({ error: err.message || "Internal server error" });
}

module.exports = errorHandler;
