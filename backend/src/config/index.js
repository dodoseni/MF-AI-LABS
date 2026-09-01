const config = {
  port: parseInt(process.env.PORT, 10) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  database: {
    server: process.env.DB_SERVER || "localhost",
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    database: process.env.DB_NAME || "skillpath",
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
  },
  ai: {
    endpoint: process.env.AI_ENDPOINT || "",
    apiKey: process.env.AI_API_KEY || "",
  },
};

module.exports = config;
