import { useState } from "react";

function EventForm({ addEvent }) {
  const [eventName, setEventName] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("Upcoming");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addEvent({
      title: eventName,
      date,
      location,
      budget: Number(budget),
      status,
    });

    setEventName("");
    setDate("");
    setLocation("");
    setBudget("");
    setStatus("Upcoming");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow mt-8">
      <h2 className="text-xl font-bold mb-4">
        Create New Event
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full border p-3 rounded-lg"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border p-3 rounded-lg"
        >
          <option>Upcoming</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Add Event
        </button>
      </form>
    </div>
  );
}

export default EventForm;