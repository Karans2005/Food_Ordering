const express = require("express");
const NotificationModel = require("../model/Notification.Model.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// ==================== CREATE NOTIFICATION ====================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      message,
      type,
      relatedId,
    } = req.body;

    // JWT se logged-in user ki ID
    const userId = req.user.userId;

    if (!title || !message) {
      return res.status(400).send({
        status: 0,
        msg: "title and message are required",
      });
    }

    const notification = new NotificationModel({
      userId,
      title,
      message,
      type,
      relatedId,
    });

    await notification.save();

    res.status(201).send({
      status: 1,
      msg: "Notification created successfully",
      notification,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to create notification",
      error: error.message,
    });
  }
});

// ==================== GET USER NOTIFICATIONS ====================

router.get("/", authMiddleware, async (req, res) => {
  try {
    // JWT se logged-in user ki ID
    const userId = req.user.userId;

    const notifications = await NotificationModel.find({
      userId,
    }).sort({ createdAt: -1 });

    res.send({
      status: 1,
      msg: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch notifications",
      error: error.message,
    });
  }
});

// ==================== MARK AS READ ====================

router.put("/:id/read", authMiddleware, async (req, res) => {
  try {
    const notification =
      await NotificationModel.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );

    if (!notification) {
      return res.status(404).send({
        status: 0,
        msg: "Notification not found",
      });
    }

    res.send({
      status: 1,
      msg: "Notification marked as read",
      notification,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to update notification",
      error: error.message,
    });
  }
});

// ==================== DELETE NOTIFICATION ====================

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const notification =
      await NotificationModel.findByIdAndDelete(
        req.params.id
      );

    if (!notification) {
      return res.status(404).send({
        status: 0,
        msg: "Notification not found",
      });
    }

    res.send({
      status: 1,
      msg: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to delete notification",
      error: error.message,
    });
  }
});

module.exports = router;