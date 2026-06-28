const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, date, location, budget, status } = req.body;

    if (!title?.trim() || !date) {
      return res.status(400).json({ error: "Title and date are required" });
    }

    const event = new Event({
      title: title.trim(),
      date,
      location: location?.trim() || "",
      budget: Number(budget) || 0,
      status: status || "Upcoming",
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/share/:shareId", async (req, res) => {
  try {
    const event = await Event.findOne({ shareId: req.params.shareId });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { title, date, location, budget, status } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title.trim();
    if (date !== undefined) updates.date = date;
    if (location !== undefined) updates.location = location.trim();
    if (budget !== undefined) updates.budget = Number(budget) || 0;
    if (status !== undefined) updates.status = status;

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
