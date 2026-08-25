const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ==================== MIDDLEWARE ====================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// ==================== TEST / HEALTH ROUTE ====================

app.get("/", (req, res) => {
  res.send("JobPilot API is running 🚀");
});

// ============================================================
// OLD USER CRUD ROUTES
// Abhi comment rakhe hain.
// Baad me zarurat ho to uncomment kar sakte ho.
// ============================================================

/*

const userModel = require("./model/User.Model.js");

// Insert Data
app.post("/data", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    time,
    date,
  } = req.body;

  try {
    const user = new userModel({
      firstName,
      lastName,
      email,
      phone,
      time,
      date,
    });

    await user.save();

    res.send({
      status: 1,
      msg: "Data Saved Successfully.",
    });
  } catch (err) {
    res.status(500).send({
      status: 0,
      msg: "Please Try Again.",
      error: err.message,
    });
  }
});

// Find Data
app.get("/listData", async (req, res) => {
  try {
    const findRes = await userModel.find();

    res.send({
      status: 1,
      msg: "Data Fetched Successfully.",
      findData: findRes,
    });
  } catch (err) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch data.",
      error: err.message,
    });
  }
});

// Update Data
app.put("/updateData/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedUser =
      await userModel.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

    if (!updatedUser) {
      return res.status(404).send({
        status: 0,
        msg: "User not found",
      });
    }

    res.send({
      status: 1,
      msg: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Update failed",
      error: error.message,
    });
  }
});

// Delete Data
app.delete("/deleteData/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleteRes =
      await userModel.findByIdAndDelete(id);

    if (!deleteRes) {
      return res.status(404).send({
        status: 0,
        msg: "Data not found",
      });
    }

    res.send({
      status: 1,
      msg: "Data Deleted Successfully",
      deletedData: deleteRes,
    });
  } catch (err) {
    console.error("Error deleting data:", err);

    res.status(500).send({
      status: 0,
      msg: "Something went wrong",
      error: err.message,
    });
  }
});

*/

// ==================== IMPORT ROUTES ====================

const authRoutes = require("./routes/Auth.Routes.js");
const jobRoutes = require("./routes/Job.Routes.js");
const providerRoutes = require("./routes/Provider.Routes.js");
const applicationRoutes = require("./routes/Application.Routes.js");
const bookingRoutes = require("./routes/Booking.Routes.js");
const messageRoutes = require("./routes/Message.Routes.js");
const notificationRoutes = require("./routes/Notification.Routes.js");
const reviewRoutes = require("./routes/Review.Routes.js");
const authMiddleware = require("./middleware/authMiddleware.js");

// ==================== API ROUTES ====================
console.log("authRoutes:", typeof authRoutes);
console.log("jobRoutes:", typeof jobRoutes);
console.log("providerRoutes:", typeof providerRoutes);
console.log("applicationRoutes:", typeof applicationRoutes);
console.log("bookingRoutes:", typeof bookingRoutes);
console.log("messageRoutes:", typeof messageRoutes);
console.log("notificationRoutes:", typeof notificationRoutes);
console.log("reviewRoutes:", typeof reviewRoutes);

app.use("/auth", authRoutes);
app.use("/jobs", authMiddleware, jobRoutes);
app.use("/providers", providerRoutes);
app.use("/applications", applicationRoutes);

app.use("/bookings", authMiddleware, bookingRoutes);

app.use("/messages", messageRoutes);
app.use("/notifications", notificationRoutes);
app.use("/reviews", reviewRoutes);



// ==================== MONGODB CONNECTION ====================

mongoose
  .connect(process.env.Mongo_Url)
  .then(() => {
    console.log("DATABASE CONNECTED");

    const port = process.env.PORT || 3500;

    app.listen(port, () => {
      console.log(`SERVER RUNNING ON PORT: ${port}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to connect to database:",
      err
    );

    // Render ko fail signal dena
    process.exit(1);
  });