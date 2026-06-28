import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import API from "../api";
import { useForm } from "../hooks/useForm";
import { rules } from "../utils/validation";
import PageHeader from "../components/ui/PageHeader";
import FormField from "../components/ui/FormField";
import FormAlert from "../components/ui/FormAlert";
import SubmitButton from "../components/ui/SubmitButton";
import { SkeletonTable } from "../components/ui/Skeleton";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FaFileExcel,
  FaFilePdf,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaTag,
  FaSearch,
  FaPlus,
  FaSave,
} from "react-icons/fa";
import AIQuickPanel from "../components/ai/AIQuickPanel";
import {
  getStatusSelectClass,
  EVENT_STATUS_OPTIONS,
} from "../utils/eventHelpers";

const eventSchema = {
  title: [
    rules.required,
    rules.minLength(3, "Event name must be at least 3 characters"),
  ],
  date: [rules.required, rules.date],
  location: [],
  budget: [(value) => (value ? rules.number(value) : "")],
  status: [rules.required],
};

const emptyEvent = {
  title: "",
  date: "",
  location: "",
  budget: "",
  status: "Upcoming",
};

function Events({ darkMode }) {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [formSuccess, setFormSuccess] = useState(null);

  const {
    values,
    errors,
    touched,
    submitting,
    formMessage,
    setFormMessage,
    setField,
    blurField,
    handleSubmit,
    resetForm,
    setValues,
  } = useForm(emptyEvent, eventSchema);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(events);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "Event_Planner_Events.xlsx");
    toast.success("Excel exported successfully");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Event Planner Report", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Title", "Date", "Location", "Budget", "Status"]],
      body: events.map((event) => [
        event.title,
        event.date,
        event.location,
        event.budget,
        event.status,
      ]),
    });
    doc.save("Event_Planner_Report.pdf");
    toast.success("PDF exported successfully");
  };

  const onSubmit = handleSubmit(async (data) => {
    setFormSuccess(null);
    const eventData = {
      title: data.title.trim(),
      date: data.date,
      location: data.location.trim(),
      budget: data.budget,
      status: data.status,
    };

    try {
      if (editId) {
        const res = await API.put(`/events/${editId}`, eventData);
        setEvents(events.map((event) => (event._id === editId ? res.data : event)));
        setEditId(null);
        setFormSuccess("Event updated successfully!");
        toast.success("Event updated successfully");
      } else {
        const res = await API.post("/events", eventData);
        setEvents([...events, res.data]);
        setFormSuccess("Event added successfully!");
        toast.success("Event added successfully");
      }
      resetForm(emptyEvent);
    } catch (error) {
      console.log(error);
      throw new Error("Failed to save event. Please check your connection and try again.");
    }
  });

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
      toast.success("Event deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete event");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await API.put(`/events/${id}`, { status: newStatus });
      setEvents(events.map((event) => (event._id === id ? res.data : event)));
      toast.success("Status updated");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update status");
    }
  };

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (event) => {
    setEditId(event._id);
    setFormSuccess(null);
    setFormMessage(null);
    setValues({
      title: event.title || "",
      date: event.date ? event.date.substring(0, 10) : "",
      location: event.location || "",
      budget: event.budget ?? "",
      status: event.status || "Upcoming",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditId(null);
    resetForm(emptyEvent);
    setFormSuccess(null);
  };

  const copyLink = (shareId) => {
    const link = `${window.location.origin}/event/${shareId}`;
    navigator.clipboard.writeText(link);
    toast.success("Event link copied!");
  };

  const statusSelectClass = getStatusSelectClass;

  if (loading) return <SkeletonTable rows={6} cols={6} darkMode={darkMode} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Events Management"
        subtitle="Create, edit, and manage all your events in one place."
        darkMode={darkMode}
        actions={
          <>
            <button type="button" onClick={exportToExcel} className="btn btn-success btn-sm">
              <FaFileExcel /> Export Excel
            </button>
            <button type="button" onClick={exportToPDF} className="btn btn-danger btn-sm">
              <FaFilePdf /> Export PDF
            </button>
          </>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card p-6 sm:p-8 ${darkMode ? "card-dark" : ""}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className={`font-display text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              {editId ? "Edit Event" : "Add New Event"}
            </h2>
            <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              {editId ? "Update the details below and save changes" : "Fill in the details to create a new event"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <AIQuickPanel
              darkMode={darkMode}
              title={values.title}
              date={values.date}
              location={values.location}
              budget={values.budget}
              onApplyBudget={(v) => setField("budget", v)}
            />
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${darkMode ? "bg-slate-700 text-slate-300" : "bg-indigo-50 text-indigo-600"}`}>
              Total: {events.length}
            </span>
          </div>
        </div>

        <form onSubmit={onSubmit} noValidate className="form-grid form-grid-sm-2 form-grid-lg-3">
          <FormAlert message={formMessage} />
          {formSuccess && (
            <FormAlert message={{ type: "success", text: formSuccess }} />
          )}

          <p className="form-section-title">Event details</p>

          <FormField
            darkMode={darkMode}
            label="Event name"
            name="title"
            icon={FaTag}
            placeholder="e.g. Summer Wedding Reception"
            value={values.title}
            onChange={setField}
            onBlur={blurField}
            error={errors.title}
            touched={touched.title}
            required
          />

          <FormField
            darkMode={darkMode}
            label="Event date"
            name="date"
            type="date"
            icon={FaCalendarAlt}
            value={values.date}
            onChange={setField}
            onBlur={blurField}
            error={errors.date}
            touched={touched.date}
            required
          />

          <FormField
            darkMode={darkMode}
            label="Location"
            name="location"
            icon={FaMapMarkerAlt}
            placeholder="City, venue, or address"
            value={values.location}
            onChange={setField}
            onBlur={blurField}
            error={errors.location}
            touched={touched.location}
            hint="Optional but recommended"
          />

          <FormField
            darkMode={darkMode}
            label="Budget (₹)"
            name="budget"
            type="number"
            icon={FaRupeeSign}
            placeholder="0"
            min="0"
            value={values.budget}
            onChange={setField}
            onBlur={blurField}
            error={errors.budget}
            touched={touched.budget}
            hint="Estimated total budget"
          />

          <FormField
            darkMode={darkMode}
            label="Status"
            name="status"
            icon={FaTag}
            value={values.status}
            onChange={setField}
            onBlur={blurField}
            error={errors.status}
            touched={touched.status}
            options={EVENT_STATUS_OPTIONS}
            required
          />

          <div className="form-actions form-actions-end form-actions-stretch-sm form-actions-stretch-lg">
            <SubmitButton
              loading={submitting}
              loadingText={editId ? "Updating…" : "Adding…"}
              className="btn btn-primary flex-1 sm:flex-none min-w-[140px]"
            >
              {editId ? (
                <>
                  <FaSave /> Update Event
                </>
              ) : (
                <>
                  <FaPlus /> Add Event
                </>
              )}
            </SubmitButton>
            {editId && (
              <button type="button" onClick={handleCancelEdit} className="btn btn-secondary">
                Cancel
              </button>
            )}
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`card p-6 sm:p-8 ${darkMode ? "card-dark" : ""}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <h2 className={`font-display text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            All Events
          </h2>
          <div className="w-full sm:max-w-xs">
            <FormField
              darkMode={darkMode}
              label="Search events"
              name="search"
              icon={FaSearch}
              placeholder="Search by name…"
              value={searchTerm}
              onChange={(_, v) => setSearchTerm(v)}
              hint={`${filteredEvents.length} result${filteredEvents.length !== 1 ? "s" : ""}`}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event._id}>
                  <td className="font-medium">{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.location || "—"}</td>
                  <td>₹{event.budget}</td>
                  <td>
                    <select
                      value={event.status}
                      onChange={(e) => updateStatus(event._id, e.target.value)}
                      className={`input select py-1.5 px-2 text-xs font-semibold w-auto min-w-[120px] ${statusSelectClass(event.status)}`}
                    >
                      {EVENT_STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" onClick={() => navigate(`/event/${event.shareId}`)} className="btn btn-primary btn-sm">
                        View
                      </button>
                      <button type="button" onClick={() => handleEdit(event)} className="btn btn-warning btn-sm">
                        Edit
                      </button>
                      <button type="button" onClick={() => copyLink(event.shareId)} className="btn btn-secondary btn-sm">
                        Share
                      </button>
                      <button type="button" onClick={() => deleteEvent(event._id)} className="btn btn-danger btn-sm">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEvents.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No events found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

export default Events;
