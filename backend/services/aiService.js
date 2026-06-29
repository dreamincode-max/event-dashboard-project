const { OpenAI } = require("openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

function getOpenAIClient() {
  if (!OPENAI_API_KEY) {
    throw new Error("OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.");
  }
  return new OpenAI({
    apiKey: OPENAI_API_KEY,
  });
}

function getProviderStatus() {
  if (OPENAI_API_KEY) return "openai";
  return "demo";
}

const PROMPTS = {
  eventDescription: {
    system: "You are an expert event marketing copywriter. Write engaging, professional event descriptions suitable for websites and social media. Use emojis sparingly. Keep under 250 words.",
    buildUser: (d) => `Write an event description for:
Title: ${d.title || "Untitled Event"}
Date: ${d.date || "TBD"}
Location: ${d.location || "TBD"}
Event Type: ${d.eventType || "general celebration"}
Expected Guests: ${d.guestCount || "100"}`,
  },
  budgetSuggestion: {
    system: "You are an expert event budget planner for Indian events. Provide realistic budget estimates in INR (₹) with category breakdown percentages and practical tips. Be specific with numbers.",
    buildUser: (d) => `Suggest a detailed budget for:
Event: ${d.title || "Untitled Event"}
Date: ${d.date || "TBD"}
Location: ${d.location || "TBD"}
Event Type: ${d.eventType || "wedding"}
Expected Guests: ${d.guestCount || "100"}`,
  },
  invitation: {
    system: "You are an expert at writing warm, elegant event invitations. Write a complete invitation letter ready to send. Keep tone professional yet personal.",
    buildUser: (d) => `Write an invitation for:
Event: ${d.title || "Special Event"}
Date: ${d.date || "TBD"}
Location: ${d.location || "TBD"}
Host: ${d.hostName || "The Event Team"}
Guest Name: ${d.guestName || "Valued Guest"}`,
  },
  schedule: {
    system: "You are an expert event day-of coordinator. Create a detailed hour-by-hour event schedule with a pre-event checklist. Use clear time blocks.",
    buildUser: (d) => `Create a day-of schedule for:
Event: ${d.title || "Event"}
Date: ${d.date || "TBD"}
Location: ${d.location || "TBD"}
Duration: ${d.duration || "6 hours"}`,
  },
  eventSummary: {
    system: "You are an expert event analyst. Write a concise executive summary report with stats, highlights, and recommended next steps.",
    buildUser: (d) => `Generate an event summary report for:
Event: ${d.title || "Portfolio Overview"}
Date: ${d.date || "N/A"}
Location: ${d.location || "N/A"}
Budget: ₹${d.budget || 0}
Status: ${d.status || "Upcoming"}
Guest Count: ${d.guestCount || "N/A"}
Total Events in Portfolio: ${d.totalEvents ?? "N/A"}
Upcoming Events: ${d.upcomingEvents ?? "N/A"}
Completed Events: ${d.completedEvents ?? "N/A"}`,
  },
};

function getFallbackResponse(type, data) {
  switch (type) {
    case "eventDescription":
      return `✨ Get ready for the ultimate experience at the upcoming ${data.title || "Special Event"}! ✨

📅 Date: ${data.date || "TBD"}
📍 Venue: ${data.location || "TBD"}
👥 Attendance: Anticipating ${data.guestCount || "100"} wonderful guests.

Join us for this spectacular ${data.eventType || "celebration"} designed to create lasting memories. From curated networking sessions to exceptional entertainment, every detail is being crafted to perfection. 

Don't miss out on being part of this landmark event. Save the date and RSVP today! #EventPlanner #SummerGala #SpecialMoments`;

    case "budgetSuggestion":
      return `Estimated budget suggestion for "${data.title || "Special Event"}":
Estimated Total Cost: ₹8,50,000 (Based on ${data.guestCount || "100"} guests)

Category Breakdown:
1. Venue & Catering (45%): ₹3,82,500
2. Decor, Floral & Production (20%): ₹1,70,000
3. Audio/Visual & Entertainment (15%): ₹1,27,500
4. Marketing & Photography (10%): ₹85,000
5. Logistics & Contingency (10%): ₹85,000

Practical Tips:
• Negotiate venue package deals that include security and cleanup services.
• Allocate at least 10% of budget for seasonal adjustments or emergency expenses.`;

    case "invitation":
      return `Dear ${data.guestName || "Valued Guest"},

It is our distinct honor and pleasure to invite you to:
🌸 ${data.title || "Special Event"} 🌸

Hosted by: ${data.hostName || "SLV Events Team"}

📅 Date: ${data.date || "TBD"}
📍 Venue: ${data.location || "TBD"}

We are putting together a memorable day of celebration, networking, and high-end experiences, and your presence would mean the world to us.

Please kindly confirm your attendance by replying to this invitation at your earliest convenience.

Warm regards,
${data.hostName || "SLV Events Team"}`;

    case "schedule":
      return `Day-Of Timeline for "${data.title || "Event"}" (Duration: ${data.duration || "6 hours"})

Pre-Event Checklist:
[ ] AV systems and soundcheck complete (2 hours prior)
[ ] Catering staff setup verified (1.5 hours prior)
[ ] Registration desk staffed and materials ready (1 hour prior)

Event Timeline:
• 00:00 - Guest Arrival & Welcoming Drinks
• 01:00 - Opening Keynote & Introduction
• 02:00 - Live Performances / Core Activity Sessions
• 03:30 - Main Dinner / Banquet & Speeches
• 05:00 - Networking Hour & Dessert
• 06:00 - Thank You Notes & Closing Remarks`;

    case "eventSummary":
      return `Executive Summary: Portfolio Overview for "${data.title || "Portfolio Overview"}"

Overview Stats:
• Target Date: ${data.date || "TBD"}
• Location: ${data.location || "N/A"}
• Estimated Budget: ₹${Number(data.budget || 0).toLocaleString("en-IN")}
• Event Status: ${data.status || "Upcoming"}
• Guest Count: ${data.guestCount || "N/A"} attendees

Key Portfolio Insights:
• Total Events Managed: ${data.totalEvents || "0"}
• Upcoming events in queue: ${data.upcomingEvents || "0"}
• Completed portfolio items: ${data.completedEvents || "0"}

Recommended Next Steps:
1. Finalize catering contracts and confirm headcount details.
2. Schedule an agenda walkthrough with the primary sponsors.`;

    default:
      return "AI generation completed successfully.";
  }
}

async function runGenerator(type, data) {
  const config = PROMPTS[type];
  if (!config) throw new Error(`Unknown AI generator type: ${type}`);

  try {
    const openai = getOpenAIClient();
    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: "system", content: config.system },
        { role: "user", content: config.buildUser(data) },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const result = completion.choices[0]?.message?.content?.trim();
    if (!result) {
      throw new Error("Empty response returned from OpenAI");
    }

    return {
      result,
      source: "openai",
    };
  } catch (err) {
    console.warn(`OpenAI call failed for ${type}. Falling back to demo mode. Error:`, err.message);
    const result = getFallbackResponse(type, data);
    return {
      result,
      source: "demo",
    };
  }
}

module.exports = {
  getProviderStatus,
  runGenerator,
};
