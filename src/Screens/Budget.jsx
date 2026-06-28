import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import API from "../api";
import PageHeader from "../components/ui/PageHeader";
import StatsCard from "../components/StatsCard";
import { SkeletonDashboard } from "../components/ui/Skeleton";
import {
  getChartTooltipStyle,
  truncateText,
} from "../utils/eventHelpers";
import { FaWallet, FaArrowUp, FaArrowDown, FaChartBar } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Budget({ darkMode }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = events.map((event) => ({
    name: truncateText(event.title, 14),
    budget: Number(event.budget || 0),
  }));

  const analytics = useMemo(() => {
    if (events.length === 0) {
      return { totalBudget: 0, highestBudget: 0, lowestBudget: 0, averageBudget: 0 };
    }
    const budgets = events.map((event) => Number(event.budget || 0));
    const totalBudget = budgets.reduce((sum, budget) => sum + budget, 0);
    return {
      totalBudget,
      highestBudget: Math.max(...budgets),
      lowestBudget: Math.min(...budgets),
      averageBudget: Math.round(totalBudget / budgets.length),
    };
  }, [events]);

  const tooltipStyle = getChartTooltipStyle(darkMode);

  if (loading) return <SkeletonDashboard darkMode={darkMode} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget Analytics"
        subtitle="Track and analyze budgets across all your events."
        darkMode={darkMode}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Budget"
          value={`₹${analytics.totalBudget.toLocaleString()}`}
          icon={<FaWallet />}
          darkMode={darkMode}
          index={0}
          accent="indigo"
        />
        <StatsCard
          title="Highest Budget"
          value={`₹${analytics.highestBudget.toLocaleString()}`}
          icon={<FaArrowUp />}
          darkMode={darkMode}
          index={1}
          accent="emerald"
        />
        <StatsCard
          title="Lowest Budget"
          value={`₹${analytics.lowestBudget.toLocaleString()}`}
          icon={<FaArrowDown />}
          darkMode={darkMode}
          index={2}
          accent="amber"
        />
        <StatsCard
          title="Average Budget"
          value={`₹${analytics.averageBudget.toLocaleString()}`}
          icon={<FaChartBar />}
          darkMode={darkMode}
          index={3}
          accent="sky"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={`card p-6 ${darkMode ? "card-dark" : ""}`}
      >
        <h2 className={`font-display text-lg font-bold mb-5 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Event Budgets
        </h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Budget</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event._id}>
                  <td className="font-medium">{event.title}</td>
                  <td className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ₹{Number(event.budget).toLocaleString()}
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan={2} className="text-center py-10 text-slate-400">
                    No events available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={`card p-6 ${darkMode ? "card-dark" : ""}`}
      >
        <h2 className={`font-display text-lg font-bold mb-5 ${darkMode ? "text-white" : "text-slate-900"}`}>
          Budget Overview Chart
        </h2>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} />
            <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 11 }} />
            <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="budget" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}

export default Budget;
