import { useState, useEffect } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useForm } from "../hooks/useForm";
import { rules } from "../utils/validation";
import PageHeader from "../components/ui/PageHeader";
import FormField from "../components/ui/FormField";
import FormAlert from "../components/ui/FormAlert";
import SubmitButton from "../components/ui/SubmitButton";
import { SkeletonTable } from "../components/ui/Skeleton";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  FaFileExcel,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaSearch,
  FaUserPlus,
} from "react-icons/fa";

const guestSchema = {
  name: [
    rules.required,
    rules.minLength(2, "Name must be at least 2 characters"),
  ],
  email: [rules.required, rules.email],
  phone: [rules.required, rules.phone],
  eventName: [
    rules.required,
    rules.minLength(2, "Event name must be at least 2 characters"),
  ],
};

const emptyGuest = {
  name: "",
  email: "",
  phone: "",
  eventName: "",
};

function Guests({ darkMode }) {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [formSuccess, setFormSuccess] = useState(null);

  const {
    values,
    errors,
    touched,
    submitting,
    formMessage,
    setField,
    blurField,
    handleSubmit,
    resetForm,
  } = useForm(emptyGuest, guestSchema);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const response = await API.get("/guests");
      setGuests(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load guests");
    } finally {
      setLoading(false);
    }
  };

  const exportGuestsToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(guests);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Guests");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });
    saveAs(data, "Event_Planner_Guests.xlsx");
    toast.success("Excel exported successfully");
  };

  const onSubmit = handleSubmit(async (data) => {
    setFormSuccess(null);
    const newGuest = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      eventName: data.eventName.trim(),
    };

    try {
      const response = await API.post("/guests", newGuest);
      setGuests([...guests, response.data]);
      resetForm(emptyGuest);
      setFormSuccess("Guest added successfully!");
      toast.success("Guest added successfully");
    } catch (error) {
      console.log(error);
      throw new Error(
        error.response?.data?.message ||
          "Failed to add guest. Please check your connection and try again."
      );
    }
  });

  const deleteGuest = async (id) => {
    if (!window.confirm("Are you sure you want to remove this guest?")) return;

    try {
      await API.delete(`/guests/${id}`);
      setGuests(guests.filter((guest) => guest._id !== id));
      toast.success("Guest deleted");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete guest");
    }
  };

  const filteredGuests = guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <SkeletonTable rows={6} cols={5} darkMode={darkMode} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guests Management"
        subtitle="Add and manage guest lists for your events."
        darkMode={darkMode}
        actions={
          <button type="button" onClick={exportGuestsToExcel} className="btn btn-success btn-sm">
            <FaFileExcel /> Export Excel
          </button>
        }
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className={`card p-6 sm:p-8 ${darkMode ? "card-dark" : ""}`}
      >
        <div className="mb-6">
          <h2 className={`font-display text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Add New Guest
          </h2>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Register a guest and assign them to an event
          </p>
        </div>

        <form onSubmit={onSubmit} noValidate className="form-grid form-grid-sm-2">
          <FormAlert message={formMessage} />
          {formSuccess && (
            <FormAlert message={{ type: "success", text: formSuccess }} />
          )}

          <p className="form-section-title">Guest information</p>

          <FormField
            darkMode={darkMode}
            label="Guest name"
            name="name"
            icon={FaUser}
            placeholder="Full name"
            value={values.name}
            onChange={setField}
            onBlur={blurField}
            error={errors.name}
            touched={touched.name}
            required
          />

          <FormField
            darkMode={darkMode}
            label="Email address"
            name="email"
            type="email"
            icon={FaEnvelope}
            placeholder="guest@example.com"
            value={values.email}
            onChange={setField}
            onBlur={blurField}
            error={errors.email}
            touched={touched.email}
            required
          />

          <FormField
            darkMode={darkMode}
            label="Phone number"
            name="phone"
            type="tel"
            icon={FaPhone}
            placeholder="+91 98765 43210"
            value={values.phone}
            onChange={setField}
            onBlur={blurField}
            error={errors.phone}
            touched={touched.phone}
            hint="At least 10 digits"
            required
          />

          <FormField
            darkMode={darkMode}
            label="Assigned event"
            name="eventName"
            icon={FaCalendarAlt}
            placeholder="Event name"
            value={values.eventName}
            onChange={setField}
            onBlur={blurField}
            error={errors.eventName}
            touched={touched.eventName}
            required
          />

          <div className="form-actions form-grid-span-2">
            <SubmitButton
              loading={submitting}
              loadingText="Adding guest…"
              className="btn btn-primary"
            >
              <FaUserPlus /> Add Guest
            </SubmitButton>
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
          <div className="flex items-center gap-3">
            <h2 className={`font-display text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
              Guest List
            </h2>
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${darkMode ? "bg-slate-700 text-slate-300" : "bg-indigo-50 text-indigo-600"}`}>
              {guests.length} total
            </span>
          </div>
          <div className="w-full sm:max-w-xs">
            <FormField
              darkMode={darkMode}
              label="Search guests"
              name="search"
              icon={FaSearch}
              placeholder="Name or email…"
              value={searchTerm}
              onChange={(_, v) => setSearchTerm(v)}
            />
          </div>
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Event</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuests.map((guest) => (
                <tr key={guest._id}>
                  <td className="font-medium">{guest.name}</td>
                  <td>{guest.email}</td>
                  <td>{guest.phone}</td>
                  <td>
                    <span className="badge badge-upcoming">{guest.eventName}</span>
                  </td>
                  <td>
                    <button type="button" onClick={() => deleteGuest(guest._id)} className="btn btn-danger btn-sm">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredGuests.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-400">
                    No guests found
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

export default Guests;
