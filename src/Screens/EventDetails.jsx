import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import API from "../api";
import { getStatusBadgeClass } from "../utils/eventHelpers";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaWallet,
  FaInfoCircle,
} from "react-icons/fa";

function EventDetails({ darkMode }) {
  const { shareId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvent = useCallback(async () => {
    if (!shareId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await API.get(`/events/share/${shareId}`);
      setEvent(res.data);
    } catch (err) {
      console.log(err);
      setEvent(null);
      setError("Unable to load this event. It may have been removed.");
    } finally {
      setLoading(false);
    }
  }, [shareId]);

  useEffect(() => {
    fetchEvent();
  }, [fetchEvent]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-4" role="status" aria-live="polite" aria-label="Loading event">
        <div className={`card p-8 ${darkMode ? "card-dark" : ""}`}>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-lg w-2/3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-lg w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div
        className={`card p-10 text-center max-w-md mx-auto ${darkMode ? "card-dark" : ""}`}
        role="alert"
      >
        <p className={`text-lg ${darkMode ? "text-slate-300" : "text-slate-600"}`}>
          {error || "Event not found"}
        </p>
      </div>
    );
  }

  const details = [
    { icon: FaCalendarAlt, label: "Date", value: event.date },
    { icon: FaMapMarkerAlt, label: "Location", value: event.location || "Not specified" },
    { icon: FaWallet, label: "Budget", value: `₹${event.budget}` },
    { icon: FaInfoCircle, label: "Status", value: event.status, badge: true },
  ];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto"
      aria-labelledby="event-title"
    >
      <div className={`card overflow-hidden ${darkMode ? "card-dark" : ""}`}>
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 sm:p-8">
          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-3">
            Event Details
          </span>
          <h1 id="event-title" className="font-display text-2xl sm:text-3xl font-bold text-white">
            {event.title}
          </h1>
        </div>

        <div className="p-6 sm:p-8 space-y-4">
          {details.map(({ icon: Icon, label, value, badge }) => (
            <div
              key={label}
              className={`flex items-center gap-4 p-4 rounded-xl ${
                darkMode ? "bg-slate-800/60" : "bg-slate-50"
              }`}
            >
              <div
                className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center shrink-0"
                aria-hidden="true"
              >
                <Icon className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
                {badge ? (
                  <span className={`badge mt-1 ${getStatusBadgeClass(event.status)}`}>
                    {value}
                  </span>
                ) : (
                  <p className={`font-semibold mt-0.5 ${darkMode ? "text-white" : "text-slate-900"}`}>
                    {value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export default EventDetails;
