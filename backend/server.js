const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const eventRoutes = require("./routes/eventRoutes");
const guestRoutes = require("./routes/guestRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Check .env loading
console.log("MONGO URI:", process.env.MONGO_URI);

// Check if MONGO_URI exists
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1);
}

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected ✅");
    console.log(
      "Database:",
      mongoose.connection.db.databaseName
    );
  })
  .catch((err) => {
    console.log("MongoDB Error ❌");
    console.error(err);
  });

// Test Route
app.get("/", (req, res) => {
  res.json({
    message: "SLV Event Planner Backend Running 🚀",
  });
});

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});