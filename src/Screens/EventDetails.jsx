import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api";

function EventDetails() {
  const { shareId } = useParams();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    fetchEvent();
  }, []);

  const fetchEvent = async () => {
    try {
      const res = await API.get(`/events/share/${shareId}`);
      setEvent(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  if (!event) {
    return (
      <div className="p-10 text-center text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-6">
        {event.title}
      </h1>

      <div className="space-y-4 text-lg">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Budget:</strong> ₹{event.budget}</p>
        <p><strong>Status:</strong> {event.status}</p>
      </div>
    </div>
  );
}

export default EventDetails;