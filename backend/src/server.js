const createApp = require('./app');

const app = createApp();

// Azure App Service sets PORT; fall back to 4000 for local development.
const PORT = process.env.PORT || 4000;

// Bind to 0.0.0.0 so the server is reachable inside Azure App Service containers.
app.listen(PORT, '0.0.0.0', () => {
  // eslint-disable-next-line no-console
  console.log(`LevelUp backend listening on port ${PORT}`);
});
