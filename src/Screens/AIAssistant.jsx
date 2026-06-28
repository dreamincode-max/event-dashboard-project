import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PageHeader from "../components/ui/PageHeader";
import AIToolCard from "../components/ai/AIToolCard";
import API from "../api";
import {
  getAIStatus,
  generateEventDescription,
  generateBudgetSuggestion,
  generateInvitation,
  generateSchedule,
  generateEventSummary,
} from "../services/aiApi";
import {
  FaPen,
  FaWallet,
  FaEnvelope,
  FaCalendarCheck,
  FaChartPie,
  FaRobot,
  FaTag,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaUsers,
  FaUser,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";
import { rules } from "../utils/validation";

const EVENT_TYPES = [
  { value: "wedding", label: "Wedding" },
  { value: "corporate", label: "Corporate" },
  { value: "birthday", label: "Birthday" },
  { value: "conference", label: "Conference" },
  { value: "celebration", label: "Celebration" },
];

const defaultForm = {
  title: "",
  date: "",
  location: "",
  eventType: "wedding",
  guestCount: "100",
  hostName: "Jahnavi",
  guestName: "",
  duration: "6 hours",
  budget: "",
  status: "Upcoming",
};

function AIAssistant({ darkMode }) {
  const [aiStatus, setAiStatus] = useState(null);
  const [events, setEvents] = useState([]);
  const [forms, setForms] = useState({
    description: { ...defaultForm },
    budget: { ...defaultForm },
    invitation: { ...defaultForm },
    schedule: { ...defaultForm },
    summary: { ...defaultForm },
  });
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [fieldTouched, setFieldTouched] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    getAIStatus().then((res) => setAiStatus(res.data));
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => {});
  }, []);

  const updateForm = (tool, field, value) => {
    setForms((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], [field]: value },
    }));
    if (formErrors[tool]) {
      setFormErrors((prev) => ({ ...prev, [tool]: "" }));
    }
    if (fieldTouched[tool]?.[field]) {
      validateField(tool, field, value);
    }
  };

  const blurField = (tool, field) => {
    setFieldTouched((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], [field]: true },
    }));
    validateField(tool, field, forms[tool][field]);
  };

  const validateField = (tool, field, value) => {
    let error = "";
    if (field === "title") {
      error = rules.required(value) || rules.minLength(3)(value);
    }
    if (field === "guestCount" && value) {
      error = rules.number(value, "Enter a valid guest count");
    }
    if (field === "budget" && value) {
      error = rules.number(value);
    }
    setFieldErrors((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], [field]: error },
    }));
    return !error;
  };

  const validateTool = (tool) => {
    const title = forms[tool].title?.trim();
    const titleError =
      rules.required(title) || rules.minLength(3)(title);
    setFieldTouched((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], title: true },
    }));
    setFieldErrors((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], title: titleError },
    }));
    if (titleError) {
      setFormErrors((prev) => ({
        ...prev,
        [tool]: "Please enter an event title (at least 3 characters).",
      }));
      return false;
    }
    setFormErrors((prev) => ({ ...prev, [tool]: "" }));
    return true;
  };

  const fillFromEvent = (tool, eventId) => {
    if (!eventId) return;
    const event = events.find((e) => e._id === eventId);
    if (!event) return;
    setForms((prev) => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        title: event.title || "",
        date: event.date ? event.date.substring(0, 10) : "",
        location: event.location || "",
        budget: String(event.budget || ""),
        status: event.status || "Upcoming",
      },
    }));
    toast.info(`Loaded "${event.title}" details`);
  };

  const runGenerator = async (tool, generatorFn) => {
    if (!validateTool(tool)) return;

    setLoading((prev) => ({ ...prev, [tool]: true }));
    try {
      const { result, source } = await generatorFn(forms[tool]);
      setResults((prev) => ({ ...prev, [tool]: { result, source } }));
      toast.success(
        source === "mock"
          ? "Generated (demo mode)"
          : `Generated via ${source}`
      );
    } catch {
      toast.error("Generation failed");
    } finally {
      setLoading((prev) => ({ ...prev, [tool]: false }));
    }
  };

  const sharedFields = [
    { name: "title", label: "Event title", icon: FaTag, placeholder: "Summer Wedding Reception", required: true },
    { name: "date", label: "Date", type: "date", icon: FaCalendarAlt },
    { name: "location", label: "Location", icon: FaMapMarkerAlt, placeholder: "Hyderabad, India" },
    { name: "eventType", label: "Event type", icon: FaTag, options: EVENT_TYPES },
    { name: "guestCount", label: "Guest count", type: "number", icon: FaUsers, placeholder: "100", hint: "Expected attendees" },
  ];

  const eventPicker = (tool) => (
    <div className="form-field">
      <label className="label">Load from existing event</label>
      <select
        defaultValue=""
        onChange={(e) => fillFromEvent(tool, e.target.value)}
        className="input select"
      >
        <option value="">— Select an event —</option>
        {events.map((ev) => (
          <option key={ev._id} value={ev._id}>
            {ev.title} ({ev.date})
          </option>
        ))}
      </select>
    </div>
  );

  const cardProps = (tool) => ({
    fieldErrors: fieldErrors[tool] || {},
    fieldTouched: fieldTouched[tool] || {},
    formError: formErrors[tool] || "",
    onFormBlur: (field) => blurField(tool, field),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Assistant"
        subtitle="Generate descriptions, budgets, invitations, schedules, and summaries powered by AI."
        darkMode={darkMode}
        actions={
          aiStatus && (
            <span
              className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full ${
                aiStatus.mockMode
                  ? "bg-amber-500/20 text-amber-200 border border-amber-400/30"
                  : "bg-emerald-500/20 text-emerald-200 border border-emerald-400/30"
              }`}
            >
              <FaRobot />
              {aiStatus.message}
            </span>
          )
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AIToolCard
          icon={FaPen}
          title="Event Description Generator"
          description="Create engaging marketing copy for your event page or social media."
          topSlot={eventPicker("description")}
          fields={sharedFields}
          formData={forms.description}
          onFormChange={(f, v) => updateForm("description", f, v)}
          onGenerate={() => runGenerator("description", generateEventDescription)}
          result={results.description?.result}
          source={results.description?.source}
          loading={loading.description}
          darkMode={darkMode}
          {...cardProps("description")}
        />

        <AIToolCard
          icon={FaWallet}
          title="Budget Suggestion"
          description="Get AI-recommended budget breakdowns tailored to your event type and guest count."
          topSlot={eventPicker("budget")}
          fields={sharedFields}
          formData={forms.budget}
          onFormChange={(f, v) => updateForm("budget", f, v)}
          onGenerate={() => runGenerator("budget", generateBudgetSuggestion)}
          result={results.budget?.result}
          source={results.budget?.source}
          loading={loading.budget}
          darkMode={darkMode}
          {...cardProps("budget")}
        />

        <AIToolCard
          icon={FaEnvelope}
          title="Invitation Generator"
          description="Draft elegant invitation letters ready to send to your guests."
          topSlot={eventPicker("invitation")}
          fields={[
            ...sharedFields.slice(0, 3),
            { name: "hostName", label: "Host name", icon: FaUser, placeholder: "Jahnavi" },
            { name: "guestName", label: "Guest name", icon: FaUser, placeholder: "Priya Sharma" },
          ]}
          formData={forms.invitation}
          onFormChange={(f, v) => updateForm("invitation", f, v)}
          onGenerate={() => runGenerator("invitation", generateInvitation)}
          result={results.invitation?.result}
          source={results.invitation?.source}
          loading={loading.invitation}
          darkMode={darkMode}
          {...cardProps("invitation")}
        />

        <AIToolCard
          icon={FaCalendarCheck}
          title="Schedule Generator"
          description="Build a detailed day-of timeline with time blocks and checklists."
          topSlot={eventPicker("schedule")}
          fields={[
            ...sharedFields.slice(0, 3),
            { name: "duration", label: "Duration", icon: FaClock, placeholder: "6 hours", hint: "e.g. 6 hours, full day" },
          ]}
          formData={forms.schedule}
          onFormChange={(f, v) => updateForm("schedule", f, v)}
          onGenerate={() => runGenerator("schedule", generateSchedule)}
          result={results.schedule?.result}
          source={results.schedule?.source}
          loading={loading.schedule}
          darkMode={darkMode}
          {...cardProps("schedule")}
        />

        <AIToolCard
          icon={FaChartPie}
          title="Event Summary Generator"
          description="Generate executive summary reports with highlights and next steps."
          topSlot={eventPicker("summary")}
          fields={[
            ...sharedFields.slice(0, 3),
            { name: "budget", label: "Budget (₹)", type: "number", icon: FaRupeeSign, placeholder: "500000" },
            {
              name: "status",
              label: "Status",
              icon: FaTag,
              options: [
                { value: "Upcoming", label: "Upcoming" },
                { value: "Completed", label: "Completed" },
                { value: "Cancelled", label: "Cancelled" },
              ],
            },
            { name: "guestCount", label: "Guest count", type: "number", icon: FaUsers, placeholder: "100" },
          ]}
          formData={forms.summary}
          onFormChange={(f, v) => updateForm("summary", f, v)}
          onGenerate={() =>
            runGenerator("summary", () =>
              generateEventSummary({
                ...forms.summary,
                totalEvents: events.length,
                upcomingEvents: events.filter((e) => e.status === "Upcoming").length,
                completedEvents: events.filter((e) => e.status === "Completed").length,
              })
            )
          }
          result={results.summary?.result}
          source={results.summary?.source}
          loading={loading.summary}
          darkMode={darkMode}
          {...cardProps("summary")}
        />
      </div>
    </div>
  );
}

export default AIAssistant;
