import { useEffect, useState } from "react";
import API from "../api";
import StatsCard from "../components/StatsCard";

import {
  FaCalendarAlt,
  FaUsers,
  FaWallet,
} from "react-icons/fa";

import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [guests, setGuests] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchGuests();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchGuests = async () => {
    try {
      const res = await API.get("/guests");
      setGuests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const totalBudget = events.reduce(
    (sum, event) =>
      sum + Number(event.budget || 0),
    0
  );

  const upcoming = events.filter(
    (event) => event.status === "Upcoming"
  ).length;

  const completed = events.filter(
    (event) => event.status === "Completed"
  ).length;

  const cancelled = events.filter(
    (event) => event.status === "Cancelled"
  ).length;

  const pieData = [
    {
      name: "Upcoming",
      value: upcoming,
    },
    {
      name: "Completed",
      value: completed,
    },
    {
      name: "Cancelled",
      value: cancelled,
    },
  ];

  const COLORS = [
    "#D8A7B1",
    "#82ca9d",
    "#ff7f7f",
  ];

  return (
    <div>
      <div className="bg-white p-8 rounded-3xl shadow mb-8">
        <h1 className="text-4xl font-bold text-[#B76E79]">
          Plan Your Dream Events
        </h1>

        <p className="mt-3 text-gray-600">
          Manage events, guests, budgets and vendors from one dashboard.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <StatsCard
          title="Events"
          value={events.length}
          icon={<FaCalendarAlt />}
        />

        <StatsCard
          title="Guests"
          value={guests.length}
          icon={<FaUsers />}
        />

        <StatsCard
          title="Budget"
          value={`₹${totalBudget.toLocaleString()}`}
          icon={<FaWallet />}
        />

        <StatsCard
          title="Upcoming"
          value={upcoming}
          icon={<FaCalendarAlt />}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-xl font-bold mb-4">
          Event Status Overview
        </h2>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={120}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;