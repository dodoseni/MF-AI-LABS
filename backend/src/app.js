const express = require('express');
const cors = require('cors');

const healthRouter = require('./routes/health');

function createApp() {
  const app = express();

  // Core middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.use('/api', healthRouter);

  // 404 handler for unknown routes
  app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
  });

  // Centralized error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({
      error: err.message || 'Internal Server Error',
    });
  });

  return app;
}

module.exports = createApp;
