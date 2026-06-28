const express = require("express");
const router = express.Router();
const Guest = require("../models/Guest");

router.get("/", async (req, res) => {
  try {
    const guests = await Guest.find();
    res.json(guests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, eventName } = req.body;

    if (!name?.trim() || !email?.trim() || !phone?.trim() || !eventName?.trim()) {
      return res.status(400).json({ message: "All guest fields are required" });
    }

    const guest = new Guest({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      eventName: eventName.trim(),
    });

    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);
    res.json({ message: "Guest Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
