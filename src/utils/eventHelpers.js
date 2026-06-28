export const EVENT_STATUS_OPTIONS = [
  { value: "Upcoming", label: "Upcoming" },
  { value: "Completed", label: "Completed" },
  { value: "Cancelled", label: "Cancelled" },
];

const STATUS_BADGE_MAP = {
  Upcoming: "badge-upcoming",
  Completed: "badge-completed",
  Cancelled: "badge-cancelled",
  Confirmed: "badge-completed",
  Pending: "badge-upcoming",
  "In Review": "badge-cancelled",
  Quoted: "badge-upcoming",
};

export function getStatusBadgeClass(status) {
  return STATUS_BADGE_MAP[status] || "badge-upcoming";
}

export function getStatusSelectClass(status) {
  if (status === "Upcoming") return "bg-indigo-500 text-white border-indigo-500";
  if (status === "Completed") return "bg-emerald-500 text-white border-emerald-500";
  return "bg-red-500 text-white border-red-500";
}

export function getChartTooltipStyle(darkMode) {
  return {
    backgroundColor: darkMode ? "#1e293b" : "#ffffff",
    color: darkMode ? "#ffffff" : "#0f172a",
    borderRadius: "12px",
    border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
  };
}

export function formatCurrency(amount) {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

export function truncateText(text, max = 12) {
  if (!text) return "";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export function parseEventDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function getEventDateKey(dateStr) {
  const d = parseEventDate(dateStr);
  return d ? d.toISOString().split("T")[0] : "";
}
