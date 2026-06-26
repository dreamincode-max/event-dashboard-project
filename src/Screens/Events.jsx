import { useState, useEffect } from "react";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
function Events({ darkMode }) {

  const [events, setEvents] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState("Upcoming");
   const [editId, setEditId] = useState(null);
   const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);


  // Get Events
  const fetchEvents = async () => {

    try {

      const res = await API.get("/events");

      setEvents(res.data);

    } catch(error) {

      console.log(error);

    }

  };
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(events);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Events"
  );

  const excelBuffer = XLSX.write(
    workbook,
    {
      bookType: "xlsx",
      type: "array",
    }
  );

  const data = new Blob(
    [excelBuffer],
    {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    }
  );

  saveAs(
    data,
    "Event_Planner_Events.xlsx"
  );
};
const exportToPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text(
    "Event Planner Report",
    14,
    20
  );

  autoTable(doc, {
    startY: 30,
    head: [
      [
        "Title",
        "Date",
        "Location",
        "Budget",
        "Status",
      ],
    ],
    body: events.map((event) => [
      event.title,
      event.date,
      event.location,
      event.budget,
      event.status,
    ]),
  });

  doc.save(
    "Event_Planner_Report.pdf"
  );
};

// Add or Update Event
const addEvent = async (e) => {
  e.preventDefault();

  const eventData = {
    title,
    date,
    location,
    budget,
    status,
  };

  try {
    if (editId) {
      const res = await API.put(
        `/events/${editId}`,
        eventData
      );

      setEvents(
        events.map((event) =>
          event._id === editId
            ? res.data
            : event
        )
      );

      setEditId(null);
    } else {
      const res = await API.post(
        "/events",
        eventData
      );

      setEvents([
        ...events,
        res.data,
      ]);
    }

    setTitle("");
    setDate("");
    setLocation("");
    setBudget("");
    setStatus("Upcoming");
  } catch (error) {
    console.log(error);
  }
};

// Delete Event
const deleteEvent = async (id) => {
  try {
    await API.delete(`/events/${id}`);

    setEvents(
      events.filter(
        (event) => event._id !== id
      )
    );
  } catch (error) {
    console.log(error);
  }
};

// Update Status
const updateStatus = async (
  id,
  newStatus
) => {
  try {
    const res = await API.put(
      `/events/${id}`,
      {
        status: newStatus,
      }
    );

    setEvents(
      events.map((event) =>
        event._id === id
          ? res.data
          : event
      )
    );
  } catch (error) {
    console.log(error);
  }
};

const filteredEvents = events.filter(
  (event) =>
    event.title
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )
);

const handleEdit = (event) => {
  setEditId(event._id);
  setTitle(event.title || "");
  setDate(
    event.date
      ? event.date.substring(0, 10)
      : ""
  );
  setLocation(event.location || "");
  setBudget(event.budget || "");
  setStatus(
    event.status || "Upcoming"
  );
};
const copyLink = (shareId) => {
  console.log("Share ID:", shareId);

  const link = `${window.location.origin}/event/${shareId}`;

  navigator.clipboard.writeText(link);

  alert("Event link copied!");
};

  return (

<div>


<h1 className="text-3xl font-bold text-white dark:text-white">
Events Management
</h1>



<div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow mb-8">


<div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">
    Total Events: {events.length}
  </h2>

  <div className="flex gap-3">

  <button
    onClick={exportToExcel}
    className="bg-green-600 text-white px-4 py-2 rounded-lg"
  >
    Export Excel
  </button>

  <button
    onClick={exportToPDF}
    className="bg-red-600 text-white px-4 py-2 rounded-lg"
  >
    Export PDF
  </button>

</div>
</div>


<form
onSubmit={addEvent}
className="grid grid-cols-2 gap-4"
>


<input
placeholder="Event Name"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="border p-3 rounded-lg"
required
/>


<input
type="date"
value={date}
onChange={(e)=>setDate(e.target.value)}
className="border p-3 rounded-lg"
required
/>


<input
placeholder="Location"
value={location}
onChange={(e)=>setLocation(e.target.value)}
className="border p-3 rounded-lg"
/>


<input
type="number"
placeholder="Budget"
value={budget}
onChange={(e)=>setBudget(e.target.value)}
className="border p-3 rounded-lg"
/>



<select
value={status}
onChange={(e)=>setStatus(e.target.value)}
className="border p-3 rounded-lg"
>

<option>
Upcoming
</option>

<option>
Completed
</option>

<option>
Cancelled
</option>

</select>



<button
className="bg-blue-600 text-white rounded-lg p-3"
>
{editId ? "Update Event" : "Add Event"}
</button>
</form>
</div>
<div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
<div className="flex justify-between mb-5">
<h2 className="text-xl font-bold">
Total Events: {events.length}
</h2>
<input
placeholder="Search events..."
value={searchTerm}
onChange={(e)=>setSearchTerm(e.target.value)}
className="border border-gray-300 dark:border-slate-600 p-3 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-pink-400"
/>
</div>
<table className="w-full border-collapse">
<thead>
<tr className="border-b">
<th className="p-3 text-left">
Name
</th>
<th className="p-3 text-left">
Date
</th>
<th className="p-3 text-left">
Location
</th>
<th className="p-3 text-left">
Budget
</th>

<th className="p-3 text-left">
Status
</th>

<th className="p-3 text-left">
Action
</th>


</tr>

</thead>



<tbody>


{
filteredEvents.map((event)=>(


<tr
  key={event._id}
  className="border-b hover:bg-pink-50 dark:hover:bg-slate-700 transition"
>


<td className="p-3">
{event.title}
</td>


<td className="p-3">
{event.date}
</td>


<td className="p-3">
{event.location}
</td>


<td className="p-3">
₹{event.budget}
</td>


<td className="p-3">


<select
  value={event.status}
  onChange={(e) =>
    updateStatus(event._id, e.target.value)
  }
  className={`p-2 rounded-lg text-white font-semibold
  ${
    event.status === "Upcoming"
      ? "bg-blue-500"
      : event.status === "Completed"
      ? "bg-green-500"
      : "bg-red-500"
  }`}
>


<option>
Upcoming
</option>


<option>
Completed
</option>


<option>
Cancelled
</option>


</select>


</td>


<td className="p-3">


<div className="flex gap-2">

  <button
    type="button"
    onClick={() => setSelectedEvent(event)}
    className="bg-blue-600 text-white px-4 py-2 rounded"
  >
    View
  </button>

  <button
    type="button"
    onClick={() => handleEdit(event)}
    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => deleteEvent(event._id)}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
  >
    Delete
  </button>
  <button
  type="button"
  onClick={() => copyLink(event.shareId)}
  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition"
>
  Copy Link
</button>

</div>


</td>


</tr>


))
}


</tbody>


</table>


</div>


</div>

  );

}


export default Events;