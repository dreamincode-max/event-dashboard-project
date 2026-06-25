import StatsCard from "../components/StatsCard";
import { useEffect, useState } from "react";
import API from "../api";
import {
  FaCalendarAlt,
  FaUsers,
  FaWallet,
  FaChartLine,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function Dashboard({ darkMode }) {
  const [events, setEvents] = useState([]);
   const [guests, setGuests] = useState([]);
   const [selectedDate, setSelectedDate] = useState(
  new Date()
);
  
   
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    const eventsRes = await API.get("/events");
    const guestsRes = await API.get("/guests");

    setEvents(eventsRes.data);
    setGuests(guestsRes.data);
  } catch (error) {
    console.log(error);
  }
};
const totalEvents = events.length;

const upcomingEvents = events.filter(
  (event) => event.status === "Upcoming"
).length;

const completedEvents = events.filter(
  (event) => event.status === "Completed"
).length;

const cancelledEvents = events.filter(
  (event) => event.status === "Cancelled"
).length;
const chartData = [
  {
    name: "Upcoming",
    value: upcomingEvents,
  },
  {
    name: "Completed",
    value: completedEvents,
  },
  {
    name: "Cancelled",
    value: cancelledEvents,
  },
];
const budgetData = events.map((event) => ({
  name: event.title,
  budget: Number(event.budget || 0),
}));
const COLORS = [
  "#3B82F6",
  "#10B981",
  "#EF4444",
];
const totalBudget = events.reduce(
  (sum, event) => sum + Number(event.budget || 0),
  0
);


const progress =
  events.length > 0
    ? Math.round(
        (completedEvents / events.length) * 100
      )
    : 0;
   
  return (
    <div className={darkMode ? "text-white" : "text-black"}>
      <div
  className={`p-8 rounded-3xl shadow-lg mb-8 ${
    darkMode
      ? "bg-slate-800 text-white"
      : "bg-gradient-to-r from-pink-200 to-pink-100"
  }`}
>
        <h1 className="text-4xl font-bold text-[#B76E79]">
        Plan Your Dream Events
        </h1>

        <p className="mt-3 text-gray-700">
          Manage events, guests, budgets and planning in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

  <StatsCard
    title="Total Events"
    value={totalEvents}
    icon={<FaCalendarAlt />}
  />

  <StatsCard
    title="Upcoming Events"
    value={upcomingEvents}
    icon={<FaCalendarAlt />}
  />

  <StatsCard
    title="Completed Events"
    value={completedEvents}
    icon={<FaChartLine />}
  />

  <StatsCard
    title="Cancelled Events"
    value={cancelledEvents}
    icon={<FaUsers />}
  />
  <StatsCard
  title="Total Guests"
  value={guests.length}
  icon={<FaUsers />}
/>

</div>
<div className="bg-white p-6 rounded-3xl shadow-lg mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Event Status Overview
  </h2>

  <ResponsiveContainer
  width="100%"
  height={300}
>
  <BarChart data={chartData}>
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />

    <Bar
      dataKey="value"
      radius={[8, 8, 0, 0]}
    >
      {chartData.map((entry, index) => (
        <Cell
          key={index}
          fill={COLORS[index]}
        />
      ))}
    </Bar>
  </BarChart>
</ResponsiveContainer>
</div>
<div className="bg-white p-6 rounded-3xl shadow-lg mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Budget Analytics
  </h2>

  <ResponsiveContainer
    width="100%"
    height={300}
  >
    <BarChart data={budgetData}>
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar
        dataKey="budget"
        fill="#10B981"
      />
    </BarChart>
  </ResponsiveContainer>
</div>
    <div className="bg-white p-6 rounded-3xl shadow-lg mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Recent Events
  </h2>

  <table className="w-full">
    <thead>
      <tr className="border-b">
        <th className="text-left p-3">
          Event
        </th>

        <th className="text-left p-3">
          Date
        </th>

        <th className="text-left p-3">
          Status
        </th>
      </tr>
    </thead>

    <tbody>
      {events
        .slice(-5)
        .reverse()
        .map((event) => (
          <tr
            key={event._id}
            className="border-b"
          >
            <td className="p-3">
              {event.title}
            </td>

            <td className="p-3">
              {event.date}
            </td>

            <td className="p-3">
              {event.status}
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
<div className="bg-white p-6 rounded-3xl shadow-lg mt-8">
  <h2 className="text-2xl font-bold mb-4">
    Event Calendar
  </h2>

  <Calendar
    onChange={setSelectedDate}
    value={selectedDate}
  />
</div>
</div>
    
  );
}

export default Dashboard;