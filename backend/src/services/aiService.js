const config = require("../config");

async function healthCheck() {
  if (!config.ai.endpoint) {
    return { configured: false };
  }
  return { configured: true };
}

async function sendMessage(_prompt) {
  throw new Error("AI service not yet implemented");
}

module.exports = { healthCheck, sendMessage };
