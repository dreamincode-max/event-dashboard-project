const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  budget: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Upcoming",
  },
});

module.exports = mongoose.model("Event", eventSchema);