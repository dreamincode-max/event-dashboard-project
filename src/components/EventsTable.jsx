function EventsTable({
  events,
  deleteEvent,
  editEvent,
}) {
  return (
    <div className="bg-white rounded-xl shadow mt-8 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-100">
            <th className="p-4 text-left">
              Event Name
            </th>
            <th className="p-4 text-left">
              Date
            </th>
            <th className="p-4 text-left">
              Location
            </th>
            <th className="p-4 text-left">
              Budget
            </th>
            <th className="p-4 text-left">
              Status
            </th>
            <th className="p-4 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {events.map((event) => (
            <tr
              key={event._id}
              className="border-b"
            >
              <td className="p-4">
                {event.title}
              </td>

              <td className="p-4">
                {event.date}
              </td>

              <td className="p-4">
                {event.location}
              </td>

              <td className="p-4">
                ₹{event.budget}
              </td>

               <td className="p-3">
  <span
    className={`px-3 py-1 rounded-full text-white text-sm ${
      event.status === "Upcoming"
        ? "bg-blue-500"
        : event.status === "Completed"
        ? "bg-green-500"
        : "bg-red-500"
    }`}
  >
    {event.status}
  </span>
</td>

              <td className="p-4 flex gap-2">
                <button
                  onClick={() =>
                    editEvent(event)
                  }
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteEvent(event._id)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventsTable;