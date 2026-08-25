const express = require("express");
const ReviewModel = require("../model/Review.Model.js");
const ProviderModel = require("../model/Provider.Model.js");
const authMiddleware = require("../middleware/authMiddleware.js");

console.log("ReviewModel type:", typeof ReviewModel);
console.log("ProviderModel type:", typeof ProviderModel);

const router = express.Router();

// ==================== CREATE REVIEW ====================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      bookingId,
      providerId,
      rating,
      comment,
    } = req.body;

    // JWT se logged-in user ki ID
    const reviewerId = req.user.userId;

    if (!bookingId || !providerId || !rating) {
      return res.status(400).send({
        status: 0,
        msg: "bookingId, providerId and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).send({
        status: 0,
        msg: "Rating must be between 1 and 5",
      });
    }

    const existingReview = await ReviewModel.findOne({
      bookingId,
    });

    if (existingReview) {
      return res.status(400).send({
        status: 0,
        msg: "Review already submitted for this booking",
      });
    }

    const review = new ReviewModel({
      bookingId,
      reviewerId,
      providerId,
      rating,
      comment: comment || "",
    });

    await review.save();

    // Recalculate provider rating
    const reviews = await ReviewModel.find({
      providerId,
    });

    const totalRating = reviews.reduce(
      (sum, item) => sum + item.rating,
      0
    );

    const averageRating =
      totalRating / reviews.length;

    await ProviderModel.findByIdAndUpdate(
      providerId,
      {
        rating: Number(averageRating.toFixed(1)),
      }
    );

    res.status(201).send({
      status: 1,
      msg: "Review submitted successfully",
      review,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to submit review",
      error: error.message,
    });
  }
});

// ==================== GET PROVIDER REVIEWS ====================

router.get(
  "/provider/:providerId",
  async (req, res) => {
    try {
      const reviews = await ReviewModel.find({
        providerId: req.params.providerId,
      })
        .populate(
          "reviewerId",
          "name email"
        )
        .sort({ createdAt: -1 });

      res.send({
        status: 1,
        msg: "Reviews fetched successfully",
        reviews,
      });
    } catch (error) {
      res.status(500).send({
        status: 0,
        msg: "Failed to fetch reviews",
        error: error.message,
      });
    }
  }
);

// ==================== DELETE REVIEW ====================

router.delete("/:id", async (req, res) => {
  try {
    const review =
      await ReviewModel.findByIdAndDelete(
        req.params.id
      );

    if (!review) {
      return res.status(404).send({
        status: 0,
        msg: "Review not found",
      });
    }

    // Recalculate provider rating
    const reviews = await ReviewModel.find({
      providerId: review.providerId,
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce(
            (sum, item) => sum + item.rating,
            0
          ) / reviews.length
        : 0;

    await ProviderModel.findByIdAndUpdate(
      review.providerId,
      {
        rating: Number(averageRating.toFixed(1)),
      }
    );

    res.send({
      status: 1,
      msg: "Review deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to delete review",
      error: error.message,
    });
  }
});

module.exports = router;