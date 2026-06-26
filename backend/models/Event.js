const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

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

  shareId: {
    type: String,
    default: uuidv4,
    unique: true,
  },
});

module.exports = mongoose.model("Event", eventSchema);