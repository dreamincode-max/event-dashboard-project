import { useEffect, useMemo, useState } from "react";
import API from "../api";

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await API.get("/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = events.map((event) => ({
    name: event.title,
    budget: Number(event.budget || 0),
  }));

  const analytics = useMemo(() => {
    if (events.length === 0) {
      return {
        totalBudget: 0,
        highestBudget: 0,
        lowestBudget: 0,
        averageBudget: 0,
      };
    }

    const budgets = events.map((event) =>
      Number(event.budget || 0)
    );

    const totalBudget = budgets.reduce(
      (sum, budget) => sum + budget,
      0
    );

    const highestBudget = Math.max(...budgets);

    const lowestBudget = Math.min(...budgets);

    const averageBudget = Math.round(
      totalBudget / budgets.length
    );

    return {
      totalBudget,
      highestBudget,
      lowestBudget,
      averageBudget,
    };
  }, [events]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Budget Analytics
      </h1>

      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
          <h3 className="text-gray-500 dark:text-gray-300">
            Total Budget
          </h3>

          <p className="text-3xl font-bold mt-2">
            ₹{analytics.totalBudget.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Highest Budget
          </h3>

          <p className="text-3xl font-bold mt-2">
            ₹{analytics.highestBudget.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Lowest Budget
          </h3>

          <p className="text-3xl font-bold mt-2">
            ₹{analytics.lowestBudget.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-gray-500">
            Average Budget
          </h3>

          <p className="text-3xl font-bold mt-2">
            ₹{analytics.averageBudget.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">
          Event Budgets
        </h2>

        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-3">
                Event
              </th>

              <th className="text-left p-3">
                Budget
              </th>
            </tr>
          </thead>

          <tbody>
            {events.map((event) => (
              <tr
                key={event._id}
                className="border-b"
              >
                <td className="p-3">
                  {event.title}
                </td>

                <td className="p-3">
                  ₹{Number(
                    event.budget
                  ).toLocaleString()}
                </td>
              </tr>
            ))}

            {events.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="text-center p-8 text-gray-500"
                >
                  No events available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">
          Budget Overview Chart
        </h2>

        <div style={{ width: "100%", height: 400 }}>
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="budget"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Budget;