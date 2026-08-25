const express = require("express");
const BookingModel = require("../model/Booking.Model");

const router = express.Router();

// ==================== CREATE BOOKING ====================

router.post("/", async (req, res) => {
  try {
    const {
      jobId,
      providerId,
      bookingDate,
      bookingTime,
      proposedPrice,
    } = req.body;

    // JWT se logged-in user ki ID
    const userId = req.user.userId;

    if (
      !jobId ||
      !providerId ||
      !bookingDate ||
      !bookingTime ||
      proposedPrice === undefined
    ) {
      return res.status(400).send({
        status: 0,
        msg: "All booking fields are required",
      });
    }

    const booking = new BookingModel({
      jobId,
      userId,
      providerId,
      bookingDate,
      bookingTime,
      proposedPrice,
    });

    await booking.save();

    res.status(201).send({
      status: 1,
      msg: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Booking creation failed",
      error: error.message,
    });
  }
});

// ==================== GET ALL BOOKINGS ====================

router.get("/", async (req, res) => {
  try {
    const bookings = await BookingModel.find()
      .populate("jobId")
      .populate("userId", "name email")
      .populate("providerId");

    res.send({
      status: 1,
      msg: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

module.exports = router;