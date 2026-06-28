import StatsCard from "../components/StatsCard";
import PageHeader from "../components/ui/PageHeader";
import { SkeletonDashboard } from "../components/ui/Skeleton";
import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaRupeeSign,
  FaFileInvoice,
  FaMapMarkerAlt,
  FaUsers,
  FaTruck,
  FaClock,
  FaPlus,
  FaUserPlus,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  RadialBarChart,
  RadialBar,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  getStatusBadgeClass,
  getChartTooltipStyle,
  getEventDateKey,
  truncateText,
} from "../utils/eventHelpers";

const VENDOR_CATEGORIES = [
  { type: "Catering", icon: "🍽️" },
  { type: "Venue", icon: "🏛️" },
  { type: "Photography", icon: "📸" },
  { type: "Decor", icon: "🌸" },
  { type: "Entertainment", icon: "🎵" },
];

const VENDOR_STATUSES = ["Confirmed", "Pending", "In Review", "Quoted"];

function buildVendorStatus(events) {
  const upcoming = events.filter((e) => e.status === "Upcoming");
  const vendors = [];

  upcoming.slice(0, 4).forEach((event, ei) => {
    VENDOR_CATEGORIES.forEach((cat, ci) => {
      const status = VENDOR_STATUSES[(ei + ci) % VENDOR_STATUSES.length];
      vendors.push({
        id: `${event._id}-${cat.type}`,
        name: cat.type,
        icon: cat.icon,
        event: event.title,
        status,
      });
    });
  });

  if (vendors.length === 0 && events.length > 0) {
    events.slice(0, 3).forEach((event, ei) => {
      vendors.push({
        id: `${event._id}-v`,
        name: VENDOR_CATEGORIES[ei % VENDOR_CATEGORIES.length].type,
        icon: VENDOR_CATEGORIES[ei % VENDOR_CATEGORIES.length].icon,
        event: event.title,
        status: event.status === "Completed" ? "Confirmed" : "Pending",
      });
    });
  }

  return vendors.slice(0, 8);
}

function buildRecentActivity(events, guests) {
  const activities = [];

  events
    .slice()
    .reverse()
    .slice(0, 4)
    .forEach((event) => {
      activities.push({
        id: `event-${event._id}`,
        icon: FaPlus,
        color: "indigo",
        text: `Event "${event.title}" ${event.status === "Completed" ? "marked completed" : "added to calendar"}`,
        time: event.date,
        meta: event.location,
      });
    });

  guests
    .slice()
    .reverse()
    .slice(0, 3)
    .forEach((guest) => {
      activities.push({
        id: `guest-${guest._id}`,
        icon: FaUserPlus,
        color: "emerald",
        text: `Guest ${guest.name} registered for ${guest.eventName}`,
        time: "Recently",
        meta: guest.email,
      });
    });

  return activities.slice(0, 7);
}

function getEventsOnDate(events, date) {
  if (!date) return [];
  const d = date.toISOString().split("T")[0];
  return events.filter((e) => getEventDateKey(e.date) === d);
}

function Dashboard({ darkMode }) {
  const [events, setEvents] = useState([]);
  const [guests, setGuests] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, guestsRes] = await Promise.all([
        API.get("/events"),
        API.get("/guests").catch(() => ({ data: [] })),
      ]);
      setEvents(eventsRes.data);
      setGuests(guestsRes.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalEvents = events.length;
    const upcoming = events.filter((e) => e.status === "Upcoming");
    const completed = events.filter((e) => e.status === "Completed");
    const cancelled = events.filter((e) => e.status === "Cancelled");

    const revenue = completed.reduce(
      (sum, e) => sum + Number(e.budget || 0),
      0
    );
    const pendingQuotations = upcoming.length;
    const totalBudget = events.reduce(
      (sum, e) => sum + Number(e.budget || 0),
      0
    );
    const progress =
      totalEvents > 0
        ? Math.round((completed.length / totalEvents) * 100)
        : 0;

    return {
      totalEvents,
      upcomingCount: upcoming.length,
      completedCount: completed.length,
      cancelledCount: cancelled.length,
      revenue,
      pendingQuotations,
      totalBudget,
      progress,
      upcomingList: upcoming
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5),
    };
  }, [events]);

  const vendorStatus = useMemo(() => buildVendorStatus(events), [events]);
  const recentActivity = useMemo(
    () => buildRecentActivity(events, guests),
    [events, guests]
  );
  const eventsOnSelectedDate = useMemo(
    () => getEventsOnDate(events, selectedDate),
    [events, selectedDate]
  );

  const eventDates = useMemo(
    () => new Set(events.map((e) => getEventDateKey(e.date)).filter(Boolean)),
    [events]
  );

  const statusChartData = [
    { name: "Upcoming", value: stats.upcomingCount, fill: "#6366f1" },
    { name: "Completed", value: stats.completedCount, fill: "#10b981" },
    { name: "Cancelled", value: stats.cancelledCount, fill: "#ef4444" },
  ].filter((d) => d.value > 0);

  const budgetChartData = events.slice(0, 6).map((e) => ({
    name: truncateText(e.title, 10),
    budget: Number(e.budget || 0),
    spent: Math.round(Number(e.budget || 0) * (e.status === "Completed" ? 0.95 : 0.6)),
  }));

  const progressRadial = [{ name: "Progress", value: stats.progress, fill: "#6366f1" }];

  const tooltipStyle = getChartTooltipStyle(darkMode);

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const d = date.toISOString().split("T")[0];
    return eventDates.has(d) ? "has-event" : null;
  };

  if (loading) return <SkeletonDashboard darkMode={darkMode} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard Overview"
        subtitle="Your event planning command center — metrics, activity, and schedules at a glance."
        darkMode={darkMode}
      />

      {/* ── Statistics Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Events"
          value={stats.totalEvents}
          icon={<FaCalendarAlt />}
          darkMode={darkMode}
          index={0}
          accent="indigo"
          subtitle="All events in portfolio"
        />
        <StatsCard
          title="Upcoming Events"
          value={stats.upcomingCount}
          icon={<FaClock />}
          darkMode={darkMode}
          index={1}
          accent="sky"
          subtitle="Scheduled ahead"
        />
        <StatsCard
          title="Completed Events"
          value={stats.completedCount}
          icon={<FaCheckCircle />}
          darkMode={darkMode}
          index={2}
          accent="emerald"
          trend={
            stats.totalEvents > 0
              ? { positive: true, label: `${stats.progress}% completion` }
              : null
          }
        />
        <StatsCard
          title="Revenue"
          value={`₹${stats.revenue.toLocaleString("en-IN")}`}
          icon={<FaRupeeSign />}
          darkMode={darkMode}
          index={3}
          accent="violet"
          subtitle="From completed events"
        />
        <StatsCard
          title="Pending Quotations"
          value={stats.pendingQuotations}
          icon={<FaFileInvoice />}
          darkMode={darkMode}
          index={4}
          accent="amber"
          subtitle="Awaiting confirmation"
        />
        <StatsCard
          title="Total Guests"
          value={guests.length}
          icon={<FaUsers />}
          darkMode={darkMode}
          index={5}
          accent="rose"
          subtitle="Across all events"
        />
      </div>

      {/* ── Progress Charts + Budget Summary ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`card p-6 lg:col-span-2 ${darkMode ? "card-dark" : ""}`}
        >
          <h2 className={`font-display text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Progress Charts
          </h2>
          <p className={`text-sm mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Event status distribution & budget tracking
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Status Breakdown
              </p>
              {statusChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {statusChartData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[220px] flex items-center justify-center text-slate-400 text-sm">
                  No event data yet
                </div>
              )}
            </div>

            <div className="relative">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Completion Rate
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="90%"
                  barSize={14}
                  data={progressRadial}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    background={{ fill: darkMode ? "#334155" : "#e2e8f0" }}
                    dataKey="value"
                    cornerRadius={8}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-6">
                <span className={`font-display text-3xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                  {stats.progress}%
                </span>
              </div>
              <p className={`text-center text-xs -mt-2 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                {stats.completedCount} of {stats.totalEvents} events completed
              </p>
            </div>
          </div>

          {budgetChartData.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Budget vs Estimated Spend
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={budgetChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke={darkMode ? "#94a3b8" : "#64748b"} />
                  <YAxis tick={{ fontSize: 11 }} stroke={darkMode ? "#94a3b8" : "#64748b"} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend />
                  <Bar dataKey="budget" name="Budget" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="spent" name="Est. Spend" fill="#10b981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </motion.div>

        {/* Budget Summary */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`card p-6 ${darkMode ? "card-dark" : ""}`}
        >
          <h2 className={`font-display text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Budget Summary
          </h2>
          <p className={`text-sm mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Financial overview
          </p>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${darkMode ? "bg-indigo-950/50 border border-indigo-800/50" : "bg-indigo-50 border border-indigo-100"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500">Total Portfolio Budget</p>
              <p className={`font-display text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
                ₹{stats.totalBudget.toLocaleString("en-IN")}
              </p>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? "bg-emerald-950/40 border border-emerald-800/40" : "bg-emerald-50 border border-emerald-100"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">Realized Revenue</p>
              <p className={`font-display text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
                ₹{stats.revenue.toLocaleString("en-IN")}
              </p>
            </div>

            <div className={`p-4 rounded-xl ${darkMode ? "bg-amber-950/40 border border-amber-800/40" : "bg-amber-50 border border-amber-100"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Pending Pipeline</p>
              <p className={`font-display text-2xl font-bold mt-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
                ₹{(stats.totalBudget - stats.revenue).toLocaleString("en-IN")}
              </p>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className={darkMode ? "text-slate-400" : "text-slate-500"}>Budget utilized</span>
                <span className={`font-semibold ${darkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                  {stats.totalBudget > 0
                    ? Math.round((stats.revenue / stats.totalBudget) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      stats.totalBudget > 0
                        ? Math.min(100, (stats.revenue / stats.totalBudget) * 100)
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.8 }}
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                />
              </div>
            </div>
          </div>

          <Link to="/budget" className="btn btn-secondary w-full mt-5 text-center">
            View Full Analytics →
          </Link>
        </motion.div>
      </div>

      {/* ── Upcoming Events + Calendar ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className={`card p-6 ${darkMode ? "card-dark" : ""}`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`font-display text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Upcoming Events
              </h2>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Next on your calendar
              </p>
            </div>
            <Link to="/events" className="btn btn-primary btn-sm">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {stats.upcomingList.length > 0 ? (
              stats.upcomingList.map((event, i) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-colors ${
                    darkMode
                      ? "bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50"
                      : "bg-slate-50 hover:bg-indigo-50/50 border border-slate-100"
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex flex-col items-center justify-center text-white shrink-0">
                    <span className="text-[10px] font-bold uppercase opacity-80">
                      {event.date
                        ? new Date(event.date).toLocaleString("en", { month: "short" })
                        : "—"}
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {event.date ? new Date(event.date).getDate() : "?"}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {event.title}
                    </p>
                    <p className={`text-xs flex items-center gap-1 mt-0.5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                      <FaMapMarkerAlt className="shrink-0" />
                      {event.location || "Location TBD"}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-sm font-bold ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                      ₹{Number(event.budget || 0).toLocaleString("en-IN")}
                    </p>
                    <span className={`badge badge-upcoming mt-1`}>Upcoming</span>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className={`text-center py-10 rounded-xl ${darkMode ? "bg-slate-800/40" : "bg-slate-50"}`}>
                <FaCalendarAlt className={`text-3xl mx-auto mb-2 ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
                <p className={darkMode ? "text-slate-400" : "text-slate-500"}>No upcoming events</p>
                <Link to="/events" className="btn btn-primary btn-sm mt-3 inline-flex">
                  Create Event
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`card p-6 ${darkMode ? "card-dark" : ""}`}
        >
          <h2 className={`font-display text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Calendar
          </h2>
          <p className={`text-sm mb-4 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Dates with events are highlighted
          </p>

          <Calendar
            onChange={setSelectedDate}
            value={selectedDate}
            tileClassName={tileClassName}
          />

          {eventsOnSelectedDate.length > 0 && (
            <div className={`mt-4 p-4 rounded-xl ${darkMode ? "bg-indigo-950/40 border border-indigo-800/40" : "bg-indigo-50 border border-indigo-100"}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-2">
                {selectedDate.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </p>
              <div className="space-y-2">
                {eventsOnSelectedDate.map((ev) => (
                  <div key={ev._id} className="flex items-center justify-between gap-2">
                    <span className={`text-sm font-medium ${darkMode ? "text-white" : "text-slate-800"}`}>
                      {ev.title}
                    </span>
                    <span className={`badge ${getStatusBadgeClass(ev.status)}`}>{ev.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Recent Activity + Vendor Status ── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`card p-6 ${darkMode ? "card-dark" : ""}`}
        >
          <h2 className={`font-display text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-slate-900"}`}>
            Recent Activity
          </h2>
          <p className={`text-sm mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Latest updates across events & guests
          </p>

          <div className="space-y-1">
            {recentActivity.length > 0 ? (
              recentActivity.map((item, i) => {
                const Icon = item.icon;
                const colorMap = {
                  indigo: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
                  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
                };
                return (
                  <div key={item.id} className="flex gap-4 relative">
                    {i < recentActivity.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 bottom-0 w-px ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
                      />
                    )}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 z-10 ${colorMap[item.color]}`}>
                      <Icon className="text-sm" />
                    </div>
                    <div className={`flex-1 pb-5 ${i === recentActivity.length - 1 ? "pb-0" : ""}`}>
                      <p className={`text-sm font-medium ${darkMode ? "text-slate-200" : "text-slate-800"}`}>
                        {item.text}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                          {item.time}
                        </span>
                        {item.meta && (
                          <>
                            <span className="text-slate-300 dark:text-slate-600">·</span>
                            <span className={`text-xs truncate ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                              {item.meta}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className={`text-center py-8 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                No recent activity yet
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`card p-6 ${darkMode ? "card-dark" : ""}`}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`font-display text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                Vendor Status
              </h2>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Vendor bookings by event
              </p>
            </div>
            <FaTruck className={`text-xl ${darkMode ? "text-slate-600" : "text-slate-300"}`} />
          </div>

          <div className="space-y-2">
            {vendorStatus.length > 0 ? (
              vendorStatus.map((vendor, i) => (
                <motion.div
                  key={vendor.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.42 + i * 0.04 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${
                    darkMode ? "bg-slate-800/50" : "bg-slate-50"
                  }`}
                >
                  <span className="text-xl w-8 text-center">{vendor.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                      {vendor.name}
                    </p>
                    <p className={`text-xs truncate ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
                      {vendor.event}
                    </p>
                  </div>
                    <span className={`badge shrink-0 ${getStatusBadgeClass(vendor.status)}`}>
                    {vendor.status}
                  </span>
                </motion.div>
              ))
            ) : (
              <div className={`text-center py-8 text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Add upcoming events to track vendor status
              </div>
            )}
          </div>

          <div className={`mt-4 pt-4 border-t grid grid-cols-4 gap-2 text-center ${darkMode ? "border-slate-700" : "border-slate-100"}`}>
            {VENDOR_STATUSES.map((s) => {
              const count = vendorStatus.filter((v) => v.status === s).length;
              return (
                <div key={s}>
                  <p className={`text-lg font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{count}</p>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">{s}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Dashboard;
