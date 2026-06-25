const express = require("express");
const router = express.Router();

const Guest = require("../models/Guest");

// Get All Guests
router.get("/", async (req, res) => {
  const guests = await Guest.find();
  res.json(guests);
});

// Add Guest
router.post("/", async (req, res) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    res.status(201).json(guest);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete Guest
router.delete("/:id", async (req, res) => {
  try {
    await Guest.findByIdAndDelete(req.params.id);

    res.json({
      message: "Guest Deleted",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;