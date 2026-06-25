const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "Registration Successful",
    });
  } catch (err) {
    console.log("REGISTER ERROR:");
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN REQUEST:", req.body);

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    });

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }

    const validPassword =
      await bcrypt.compare(
        password,
        user.password
      );

    console.log(
      "PASSWORD MATCH:",
      validPassword
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "secret123"
    );

    res.json({
      token,
      message: "Login Successful",
    });
  } catch (err) {
    console.log("LOGIN ERROR:");
    console.log(err);

    res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;