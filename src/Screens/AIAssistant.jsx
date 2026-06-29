import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import PageHeader from "../components/ui/PageHeader";
import FormField from "../components/ui/FormField";
import FormAlert from "../components/ui/FormAlert";
import SubmitButton from "../components/ui/SubmitButton";
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
  FaMagic,
  FaCopy,
  FaDownload,
  FaCheck,
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
  const [selectedEvents, setSelectedEvents] = useState({
    description: "",
    budget: "",
    invitation: "",
    schedule: "",
    summary: "",
  });
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
  const [copiedStates, setCopiedStates] = useState({});

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
    const titleError = rules.required(title) || rules.minLength(3)(title);
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
    setSelectedEvents((prev) => ({ ...prev, [tool]: eventId }));
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
      const payload =
        tool === "summary"
          ? {
              ...forms.summary,
              totalEvents: events.length,
              upcomingEvents: events.filter((e) => e.status === "Upcoming").length,
              completedEvents: events.filter((e) => e.status === "Completed").length,
            }
          : forms[tool];

      const { result, source } = await generatorFn(payload);
      setResults((prev) => ({ ...prev, [tool]: { result, source } }));
      toast.success(`Generated via ${source}`);
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || err.message || "Generation failed";
      toast.error(errorMsg);
    } finally {
      setLoading((prev) => ({ ...prev, [tool]: false }));
    }
  };

  const handleCopyToClipboard = (tool) => {
    const text = results[tool]?.result;
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedStates((prev) => ({ ...prev, [tool]: true }));
    toast.success("Copied to clipboard!");
    setTimeout(() => {
      setCopiedStates((prev) => ({ ...prev, [tool]: false }));
    }, 2000);
  };

  const handleDownload = (tool, title) => {
    const text = results[tool]?.result;
    if (!text) return;
    const element = document.createElement("a");
    const file = new Blob([text], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/ /g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("File download started");
  };

  const handleApplyBudgetToEvent = async (tool) => {
    const eventId = selectedEvents[tool];
    if (!eventId) {
      toast.warning("Please select an event from the list to apply the budget");
      return;
    }
    const text = results.budget?.result;
    if (!text) return;

    // Extract budget amount
    const match = text.match(/₹([\d,]+)/);
    const suggestedAmount = match ? match[1].replace(/,/g, "") : null;

    if (!suggestedAmount) {
      toast.warning("Could not extract a valid budget number from the suggested text");
      return;
    }

    try {
      const event = events.find((e) => e._id === eventId);
      if (!event) return;

      await API.put(`/events/${eventId}`, {
        title: event.title,
        date: event.date,
        location: event.location,
        status: event.status,
        budget: Number(suggestedAmount),
      });

      // Update local event list budget
      setEvents((prev) =>
        prev.map((e) =>
          e._id === eventId ? { ...e, budget: Number(suggestedAmount) } : e
        )
      );

      toast.success(`Successfully applied budget of ₹${Number(suggestedAmount).toLocaleString("en-IN")} to "${event.title}"!`);
    } catch (err) {
      toast.error("Failed to update event budget in database");
    }
  };

  const sharedFields = (tool) => [
    { name: "title", label: "Event Title", icon: FaTag, placeholder: "e.g. Summer Wedding Reception", required: true },
    { name: "date", label: "Event Date", type: "date", icon: FaCalendarAlt },
    { name: "location", label: "Location", icon: FaMapMarkerAlt, placeholder: "City, venue, or address" },
  ];

  const renderCardHeader = (Icon, title, description) => (
    <div className="flex items-start gap-4 mb-5">
      <div className={`p-3 rounded-xl ${darkMode ? "bg-indigo-600/10 text-indigo-400 border border-slate-700" : "bg-indigo-50 text-indigo-600"}`}>
        <Icon className="text-lg" />
      </div>
      <div>
        <h3 className={`font-display text-base font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
          {title}
        </h3>
        <p className={`text-xs mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          {description}
        </p>
      </div>
    </div>
  );

  const renderEventPicker = (tool) => (
    <div className="form-field mb-4">
      <label className="label">Load From Event</label>
      <select
        value={selectedEvents[tool]}
        onChange={(e) => fillFromEvent(tool, e.target.value)}
        className="input select"
      >
        <option value="">— Select an Event —</option>
        {events.map((ev) => (
          <option key={ev._id} value={ev._id}>
            {ev.title}
          </option>
        ))}
      </select>
    </div>
  );

  const renderOutputArea = (tool, title) => {
    const result = results[tool];
    if (loading[tool]) {
      return (
        <div className="mt-5 space-y-3 p-4 rounded-xl border border-dashed border-slate-700 bg-slate-950/20">
          <div className="h-4 rounded skeleton w-3/4" />
          <div className="h-4 rounded skeleton w-5/6" />
          <div className="h-4 rounded skeleton w-2/3" />
        </div>
      );
    }
    if (!result) return null;

    return (
      <div className={`mt-5 p-4 rounded-xl border relative ${
        darkMode ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"
      }`}>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            darkMode ? "bg-indigo-500/10 text-indigo-400" : "bg-indigo-50 text-indigo-600"
          }`}>
            Response (via {result.source})
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleCopyToClipboard(tool)}
              title="Copy"
              className={`p-1.5 rounded-lg border transition-colors ${
                darkMode
                  ? "text-slate-400 hover:text-white bg-slate-800 border-slate-700"
                  : "text-slate-600 hover:text-slate-950 bg-white border-slate-200"
              }`}
            >
              {copiedStates[tool] ? <FaCheck className="text-emerald-400 text-xs" /> : <FaCopy className="text-xs" />}
            </button>
            <button
              onClick={() => handleDownload(tool, title)}
              title="Download as Text"
              className={`p-1.5 rounded-lg border transition-colors ${
                darkMode
                  ? "text-slate-400 hover:text-white bg-slate-800 border-slate-700"
                  : "text-slate-600 hover:text-slate-950 bg-white border-slate-200"
              }`}
            >
              <FaDownload className="text-xs" />
            </button>
          </div>
        </div>
        <div className="whitespace-pre-wrap text-sm leading-relaxed font-body text-slate-800 dark:text-slate-200 select-text max-h-[300px] overflow-y-auto">
          {result.result}
        </div>

        {tool === "budget" && (
          <div className="mt-4 pt-3 border-t border-slate-800/20 flex items-center justify-between gap-4">
            <span className="text-[11px] text-slate-500">
              {selectedEvents.budget ? "Apply recommended budget to the selected event record." : "Select an event above to apply this budget."}
            </span>
            <button
              type="button"
              disabled={!selectedEvents.budget}
              onClick={() => handleApplyBudgetToEvent("budget")}
              className="btn btn-success btn-sm flex items-center gap-1.5 text-xs font-semibold shrink-0"
            >
              <FaCheck className="text-[10px]" /> Apply Budget
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderFormFields = (tool, fields) => {
    return (
      <div className="form-grid form-grid-sm-2 gap-4">
        {fields.map((field) => (
          <FormField
            key={field.name}
            darkMode={darkMode}
            label={field.label}
            name={field.name}
            type={field.type}
            icon={field.icon}
            placeholder={field.placeholder}
            value={forms[tool][field.name] || ""}
            onChange={(_, val) => updateForm(tool, field.name, val)}
            onBlur={() => blurField(tool, field.name)}
            error={fieldErrors[tool]?.[field.name]}
            touched={fieldTouched[tool]?.[field.name]}
            hint={field.hint}
            required={field.required}
            options={field.options}
            variant="default"
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="AI Assistant"
          subtitle="Generate descriptions, budgets, invitations, schedules, and summaries powered by AI."
          darkMode={darkMode}
        />
        {aiStatus && (
          <div className={`flex items-center gap-2 self-start md:self-center px-3 py-1.5 rounded-full text-xs font-semibold ${
            darkMode ? "bg-slate-800 text-indigo-400 border border-slate-700" : "bg-indigo-50 text-indigo-600 border border-indigo-100"
          }`}>
            <FaRobot className="animate-pulse" />
            <span>AI Ready: {aiStatus.provider}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tool 1: Description Generator */}
        <div className={`card p-6 ${darkMode ? "card-dark" : ""}`}>
          {renderCardHeader(FaPen, "Event Description Generator", "Create engaging marketing copy for your event page or social media.")}
          {renderEventPicker("description")}
          <div className={`border-t my-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />
          {renderFormFields("description", [
            ...sharedFields("description"),
            { name: "eventType", label: "Event Type", icon: FaTag, options: EVENT_TYPES },
            { name: "guestCount", label: "Expected Guests", type: "number", icon: FaUsers, placeholder: "100" },
          ])}
          <FormAlert message={formErrors.description ? { type: "error", text: formErrors.description } : null} variant="default" className="mt-4" />
          <SubmitButton
            loading={loading.description}
            loadingText="Generating..."
            onClick={() => runGenerator("description", generateEventDescription)}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
          >
            <FaMagic /> Generate with AI
          </SubmitButton>
          {renderOutputArea("description", "Event Description")}
        </div>

        {/* Tool 2: Budget Suggestion */}
        <div className={`card p-6 ${darkMode ? "card-dark" : ""}`}>
          {renderCardHeader(FaWallet, "Budget Suggestion", "Get AI-recommended budget breakdowns tailored to your event details.")}
          {renderEventPicker("budget")}
          <div className={`border-t my-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />
          {renderFormFields("budget", [
            ...sharedFields("budget"),
            { name: "eventType", label: "Event Type", icon: FaTag, options: EVENT_TYPES },
            { name: "guestCount", label: "Expected Guests", type: "number", icon: FaUsers, placeholder: "100" },
          ])}
          <FormAlert message={formErrors.budget ? { type: "error", text: formErrors.budget } : null} variant="default" className="mt-4" />
          <SubmitButton
            loading={loading.budget}
            loadingText="Generating..."
            onClick={() => runGenerator("budget", generateBudgetSuggestion)}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
          >
            <FaMagic /> Generate with AI
          </SubmitButton>
          {renderOutputArea("budget", "Budget Suggestion")}
        </div>

        {/* Tool 3: Invitation Generator */}
        <div className={`card p-6 ${darkMode ? "card-dark" : ""}`}>
          {renderCardHeader(FaEnvelope, "Invitation Writer", "Draft professional yet warm invitation letters ready to send to guests.")}
          {renderEventPicker("invitation")}
          <div className={`border-t my-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />
          {renderFormFields("invitation", [
            ...sharedFields("invitation"),
            { name: "hostName", label: "Host Name", icon: FaUser, placeholder: "Jahnavi" },
            { name: "guestName", label: "Guest Name", icon: FaUser, placeholder: "Priya Sharma" },
          ])}
          <FormAlert message={formErrors.invitation ? { type: "error", text: formErrors.invitation } : null} variant="default" className="mt-4" />
          <SubmitButton
            loading={loading.invitation}
            loadingText="Generating..."
            onClick={() => runGenerator("invitation", generateInvitation)}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
          >
            <FaMagic /> Generate with AI
          </SubmitButton>
          {renderOutputArea("invitation", "Invitation Writer")}
        </div>

        {/* Tool 4: Schedule Planner */}
        <div className={`card p-6 ${darkMode ? "card-dark" : ""}`}>
          {renderCardHeader(FaCalendarCheck, "Schedule Planner", "Build a detailed day-of timeline with time blocks and checklists.")}
          {renderEventPicker("schedule")}
          <div className={`border-t my-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />
          {renderFormFields("schedule", [
            ...sharedFields("schedule"),
            { name: "duration", label: "Duration", icon: FaClock, placeholder: "6 hours", hint: "e.g. 6 hours, full day" },
          ])}
          <FormAlert message={formErrors.schedule ? { type: "error", text: formErrors.schedule } : null} variant="default" className="mt-4" />
          <SubmitButton
            loading={loading.schedule}
            loadingText="Generating..."
            onClick={() => runGenerator("schedule", generateSchedule)}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
          >
            <FaMagic /> Generate with AI
          </SubmitButton>
          {renderOutputArea("schedule", "Schedule Planner")}
        </div>

        {/* Tool 5: Event Summary Generator */}
        <div className={`card p-6 ${darkMode ? "card-dark" : ""}`}>
          {renderCardHeader(FaChartPie, "Event Summary Generator", "Generate executive summary reports with highlights and next steps.")}
          {renderEventPicker("summary")}
          <div className={`border-t my-4 ${darkMode ? "border-slate-800" : "border-slate-100"}`} />
          {renderFormFields("summary", [
            ...sharedFields("summary"),
            { name: "budget", label: "Total Budget (₹)", type: "number", icon: FaRupeeSign, placeholder: "500000" },
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
          ])}
          <FormAlert message={formErrors.summary ? { type: "error", text: formErrors.summary } : null} variant="default" className="mt-4" />
          <SubmitButton
            loading={loading.summary}
            loadingText="Generating..."
            onClick={() => runGenerator("summary", generateEventSummary)}
            className="btn btn-primary w-full flex items-center justify-center gap-2 mt-4"
          >
            <FaMagic /> Generate with AI
          </SubmitButton>
          {renderOutputArea("summary", "Event Summary")}
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
