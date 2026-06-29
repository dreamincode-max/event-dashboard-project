import API from "../api";

async function callAI(endpoint, data) {
  const res = await API.post(`/ai/${endpoint}`, data, { timeout: 60000 });
  return res.data;
}

export const getAIStatus = () =>
  API.get("/ai/status").catch(() => ({
    data: { provider: "none", mockMode: true, message: "Offline" },
  }));

export const generateEventDescription = (data) =>
  callAI("event-description", data);

export const generateBudgetSuggestion = (data) =>
  callAI("budget-suggestion", data);

export const generateInvitation = (data) =>
  callAI("invitation", data);

export const generateSchedule = (data) =>
  callAI("schedule", data);

export const generateEventSummary = (data) =>
  callAI("event-summary", data);

export function extractSuggestedBudget(text) {
  const match = text.match(/₹([\d,]+)/);
  if (!match) return null;
  return match[1].replace(/,/g, "");
}
