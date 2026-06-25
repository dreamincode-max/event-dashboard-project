import { useState, useEffect } from "react";

function EditEventModal({
  isOpen,
  event,
  onSave,
  onClose,
}) {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    budget: "",
    status: "Upcoming",
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
      });
    }
  }, [event]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[450px] shadow-xl">
        <h2 className="text-2xl font-bold mb-5">
          Edit Event
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Event Name"
            value={formData.title || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="date"
            name="date"
            value={formData.date || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget || ""}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          />

          <select
            name="status"
            value={formData.status || "Upcoming"}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="Upcoming">
              Upcoming
            </option>

            <option value="Completed">
              Completed
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg"
          >
            Save Changes
          </button>

          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-5 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditEventModal;