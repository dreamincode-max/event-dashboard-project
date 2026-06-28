import API from "../api";

const clientMocks = {
  eventDescription: (d) =>
    `Join us for ${d.title || "an unforgettable event"} — a ${d.eventType || "celebration"} at ${d.location || "a beautiful venue"} on ${d.date || "TBD"}. Expect curated entertainment, fine dining, and memorable moments for ${d.guestCount || 100} guests. #SLVEvents`,

  budgetSuggestion: (d) => {
    const guests = Number(d.guestCount) || 100;
    const total = guests * 5500;
    return `Recommended Budget: ₹${total.toLocaleString("en-IN")}\n\nVenue: ₹${Math.round(total * 0.3).toLocaleString("en-IN")}\nCatering: ₹${Math.round(total * 0.4).toLocaleString("en-IN")}\nDécor: ₹${Math.round(total * 0.15).toLocaleString("en-IN")}\nEntertainment: ₹${Math.round(total * 0.15).toLocaleString("en-IN")}`;
  },

  invitation: (d) =>
    `Dear ${d.guestName || "Valued Guest"},\n\nYou are cordially invited to ${d.title || "our special event"} on ${d.date || "TBD"} at ${d.location || "TBD"}.\n\nWarm regards,\n${d.hostName || "The Event Team"}`,

  schedule: (d) =>
    `Schedule for ${d.title || "Event"} — ${d.date || "TBD"}\n\n2:00 PM — Guest arrival\n3:00 PM — Welcome program\n4:00 PM — Main event\n6:00 PM — Dinner\n8:00 PM — Closing`,

  eventSummary: (d) =>
    `Summary: ${d.title || "Event Portfolio"}\nStatus: ${d.status || "Upcoming"}\nBudget: ₹${Number(d.budget || 0).toLocaleString("en-IN")}\nTotal Events: ${d.totalEvents ?? "—"}\nUpcoming: ${d.upcomingEvents ?? "—"}\nCompleted: ${d.completedEvents ?? "—"}`,
};

async function callAI(endpoint, data, mockFn) {
  try {
    const res = await API.post(`/ai/${endpoint}`, data, { timeout: 60000 });
    return res.data;
  } catch {
    return { result: mockFn(data), source: "mock" };
  }
}

export const getAIStatus = () =>
  API.get("/ai/status").catch(() => ({
    data: { provider: "mock", mockMode: true, message: "Demo mode (offline)" },
  }));

export const generateEventDescription = (data) =>
  callAI("event-description", data, clientMocks.eventDescription);

export const generateBudgetSuggestion = (data) =>
  callAI("budget-suggestion", data, clientMocks.budgetSuggestion);

export const generateInvitation = (data) =>
  callAI("invitation", data, clientMocks.invitation);

export const generateSchedule = (data) =>
  callAI("schedule", data, clientMocks.schedule);

export const generateEventSummary = (data) =>
  callAI("event-summary", data, clientMocks.eventSummary);

export function extractSuggestedBudget(text) {
  const match = text.match(/₹([\d,]+)/);
  if (!match) return null;
  return match[1].replace(/,/g, "");
}
