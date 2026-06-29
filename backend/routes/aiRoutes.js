const express = require("express");
const { runGenerator, getProviderStatus } = require("../services/aiService");

const router = express.Router();

router.get("/status", (req, res) => {
  const provider = getProviderStatus();
  res.json({
    provider,
    mockMode: provider !== "openai",
    message:
      provider === "openai"
        ? `Connected to ${provider}`
        : "No API key configured",
  });
});

const handlers = {
  "event-description": "eventDescription",
  "budget-suggestion": "budgetSuggestion",
  invitation: "invitation",
  schedule: "schedule",
  "event-summary": "eventSummary",
};

Object.entries(handlers).forEach(([route, type]) => {
  router.post(`/${route}`, async (req, res) => {
    try {
      const { result, source } = await runGenerator(type, req.body || {});
      res.json({ result, source });
    } catch (err) {
      console.error(`AI ${route} error:`, err.message);
      res.status(500).json({ error: "AI generation failed", message: err.message });
    }
  });
});

module.exports = router;
