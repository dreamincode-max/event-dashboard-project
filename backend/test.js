const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://jahnaviummadi007_db_user:EventDashboard1234@cluster0.m7p1lhs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDB Connected ✅");
  })
  .catch((err) => {
    console.error(err);
  });