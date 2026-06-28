const axios = require("axios");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

function getProviderStatus() {
  if (OPENAI_API_KEY) return "openai";
  if (GEMINI_API_KEY) return "gemini";
  return "mock";
}

async function callOpenAI(systemPrompt, userPrompt) {
  const response = await axios.post(
    "https://api.openai.com/v1/chat/completions",
    {
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    },
    {
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 45000,
    }
  );

  return response.data.choices[0].message.content.trim();
}

async function callGemini(systemPrompt, userPrompt) {
  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await axios.post(
    url,
    {
      contents: [
        {
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1200,
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: 45000,
    }
  );

  const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty Gemini response");
  return text.trim();
}

async function generateWithAI(systemPrompt, userPrompt) {
  if (OPENAI_API_KEY) {
    try {
      const result = await callOpenAI(systemPrompt, userPrompt);
      return { result, source: "openai" };
    } catch (err) {
      console.error("OpenAI error:", err.message);
    }
  }

  if (GEMINI_API_KEY) {
    try {
      const result = await callGemini(systemPrompt, userPrompt);
      return { result, source: "gemini" };
    } catch (err) {
      console.error("Gemini error:", err.message);
    }
  }

  return null;
}

function mockEventDescription({ title, date, location, eventType, guestCount }) {
  const type = eventType || "celebration";
  const guests = guestCount || 100;
  const place = location || "a beautiful venue";

  return `Join us for ${title || "an unforgettable event"} — a ${type} designed to bring people together in style.

📅 Date: ${date || "TBD"}
📍 Venue: ${place}
👥 Expected Guests: ${guests}

Experience an evening filled with curated entertainment, exquisite dining, and meaningful connections. From the welcome reception to the grand finale, every moment has been thoughtfully planned to create lasting memories.

Whether you're joining us in person or celebrating from afar, we can't wait to share this special occasion with you. Dress code: Smart casual. RSVP appreciated.

#${(title || "Event").replace(/\s+/g, "")} #EventPlanning #SLVEvents`;
}

function mockBudgetSuggestion({ title, date, location, guestCount, eventType }) {
  const guests = Number(guestCount) || 100;
  const type = (eventType || "wedding").toLowerCase();
  const basePerGuest =
    type.includes("corporate") ? 2500 :
    type.includes("birthday") ? 1500 :
    type.includes("conference") ? 3000 :
    4000;

  const venue = Math.round(guests * 800);
  const catering = Math.round(guests * basePerGuest);
  const decor = Math.round(catering * 0.25);
  const entertainment = Math.round(catering * 0.15);
  const photography = Math.round(catering * 0.1);
  const misc = Math.round(catering * 0.08);
  const total = venue + catering + decor + entertainment + photography + misc;

  return `💰 AI Budget Suggestion for "${title || "Your Event"}"
📅 ${date || "TBD"} · 📍 ${location || "TBD"} · 👥 ${guests} guests

Recommended Total Budget: ₹${total.toLocaleString("en-IN")}

Breakdown:
• Venue & Setup: ₹${venue.toLocaleString("en-IN")} (30%)
• Catering & Beverages: ₹${catering.toLocaleString("en-IN")} (40%)
• Décor & Florals: ₹${decor.toLocaleString("en-IN")} (12%)
• Entertainment: ₹${entertainment.toLocaleString("en-IN")} (8%)
• Photography/Videography: ₹${photography.toLocaleString("en-IN")} (5%)
• Contingency & Misc: ₹${misc.toLocaleString("en-IN")} (5%)

💡 Tips:
- Book venue 3–6 months ahead for ${type} events
- Allocate 10% buffer for last-minute changes
- Negotiate catering packages for groups over 80 guests`;
}

function mockInvitation({ title, date, location, hostName, guestName }) {
  const host = hostName || "The Event Team";
  const guest = guestName || "Valued Guest";

  return `✉️ You're Invited!

Dear ${guest},

${host} warmly invites you to ${title || "a special celebration"}.

📅 When: ${date || "Date to be announced"}
📍 Where: ${location || "Venue details to follow"}

We would be honoured by your presence as we celebrate this wonderful occasion together. An unforgettable experience awaits — fine dining, entertainment, and cherished company.

Please confirm your attendance at your earliest convenience.

With warm regards,
${host}

—
Powered by SLV Events Planner`;
}

function mockSchedule({ title, date, location, duration }) {
  const eventTitle = title || "Event";
  const hrs = duration || "6 hours";

  return `📋 Event Schedule — ${eventTitle}
📅 ${date || "TBD"} · 📍 ${location || "TBD"} · ⏱ Duration: ${hrs}

8:00 AM — Vendor setup & venue walkthrough
10:00 AM — Final décor and technical checks
12:00 PM — Team briefing & guest list review
2:00 PM — Guest registration opens
3:00 PM — Welcome reception & refreshments
4:00 PM — Main program begins
5:30 PM — Key moments / presentations
6:30 PM — Dinner service
8:00 PM — Entertainment & social hour
9:30 PM — Closing remarks & guest departure
10:00 PM — Breakdown begins

✅ Pre-event checklist:
□ Confirm vendor arrival times
□ Test AV equipment
□ Prepare emergency contact list
□ Assign team roles for each segment`;
}

function mockEventSummary({ title, date, location, budget, status, guestCount, totalEvents, upcomingEvents, completedEvents }) {
  return `📊 Event Summary Report

Event: ${title || "All Events Overview"}
Status: ${status || "Mixed"}
Date: ${date || "Various dates"}
Location: ${location || "Multiple venues"}
Budget: ₹${Number(budget || 0).toLocaleString("en-IN")}
Expected Guests: ${guestCount || "N/A"}

Overview:
This ${status === "Completed" ? "successfully completed" : status === "Cancelled" ? "cancelled" : "upcoming"} event ${title ? `"${title}"` : "portfolio"} ${location ? `at ${location}` : ""} represents ${status === "Upcoming" ? "active planning efforts" : "a milestone in your event calendar"}.

Portfolio Stats:
• Total Events Managed: ${totalEvents ?? "—"}
• Upcoming: ${upcomingEvents ?? "—"}
• Completed: ${completedEvents ?? "—"}

Key Highlights:
✓ Budget allocation ${Number(budget) > 50000 ? "requires careful tracking — consider weekly reviews" : "is within manageable range"}
✓ Guest coordination ${guestCount ? `for ${guestCount} attendees needs RSVP tracking` : "should be prioritised"}
✓ ${status === "Upcoming" ? "Vendor confirmations recommended 2 weeks before event date" : "Post-event feedback collection recommended"}

Recommended Next Steps:
1. Review vendor contracts and payment schedules
2. Send reminder communications to confirmed guests
3. Prepare day-of coordination timeline
4. ${status === "Completed" ? "Generate final expense report and archive event files" : "Conduct a final walkthrough 48 hours before the event"}

Generated by SLV Events AI Assistant`;
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
    mock: mockEventDescription,
  },
  budgetSuggestion: {
    system: "You are an expert event budget planner for Indian events. Provide realistic budget estimates in INR (₹) with category breakdown percentages and practical tips. Be specific with numbers.",
    buildUser: (d) => `Suggest a detailed budget for:
Event: ${d.title || "Untitled Event"}
Date: ${d.date || "TBD"}
Location: ${d.location || "TBD"}
Event Type: ${d.eventType || "wedding"}
Expected Guests: ${d.guestCount || "100"}`,
    mock: mockBudgetSuggestion,
  },
  invitation: {
    system: "You are an expert at writing warm, elegant event invitations. Write a complete invitation letter ready to send. Keep tone professional yet personal.",
    buildUser: (d) => `Write an invitation for:
Event: ${d.title || "Special Event"}
Date: ${d.date || "TBD"}
Location: ${d.location || "TBD"}
Host: ${d.hostName || "The Event Team"}
Guest Name: ${d.guestName || "Valued Guest"}`,
    mock: mockInvitation,
  },
  schedule: {
    system: "You are an expert event day-of coordinator. Create a detailed hour-by-hour event schedule with a pre-event checklist. Use clear time blocks.",
    buildUser: (d) => `Create a day-of schedule for:
Event: ${d.title || "Event"}
Date: ${d.date || "TBD"}
Location: ${d.location || "TBD"}
Duration: ${d.duration || "6 hours"}`,
    mock: mockSchedule,
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
    mock: mockEventSummary,
  },
};

async function runGenerator(type, data) {
  const config = PROMPTS[type];
  if (!config) throw new Error(`Unknown AI generator type: ${type}`);

  const aiResponse = await generateWithAI(
    config.system,
    config.buildUser(data)
  );

  if (aiResponse) return aiResponse;

  return {
    result: config.mock(data),
    source: "mock",
  };
}

module.exports = {
  getProviderStatus,
  runGenerator,
};
