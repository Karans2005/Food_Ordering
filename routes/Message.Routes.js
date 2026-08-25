const express = require("express");
const MessageModel = require("../model/Message.Model.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// ==================== SEND MESSAGE ====================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      receiverId,
      message,
    } = req.body;

    // JWT se logged-in user ki ID
    const senderId = req.user.userId;

    if (!receiverId || !message) {
      return res.status(400).send({
        status: 0,
        msg: "receiverId and message are required",
      });
    }

    const newMessage = new MessageModel({
      senderId,
      receiverId,
      message,
    });

    await newMessage.save();

    res.status(201).send({
      status: 1,
      msg: "Message sent successfully",
      message: newMessage,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to send message",
      error: error.message,
    });
  }
});

// ==================== GET ALL MESSAGES ====================

router.get("/", async (req, res) => {
  try {
    const messages = await MessageModel.find()
      .populate("senderId", "name email")
      .populate("receiverId", "name email")
      .sort({ createdAt: -1 });

    res.send({
      status: 1,
      msg: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch messages",
      error: error.message,
    });
  }
});

// ==================== GET CONVERSATION ====================

router.get(
  "/conversation/:user1/:user2",
  async (req, res) => {
    try {
      const { user1, user2 } = req.params;

      const messages = await MessageModel.find({
        $or: [
          {
            senderId: user1,
            receiverId: user2,
          },
          {
            senderId: user2,
            receiverId: user1,
          },
        ],
      })
        .populate("senderId", "name email")
        .populate("receiverId", "name email")
        .sort({ createdAt: 1 });

      res.send({
        status: 1,
        msg: "Conversation fetched successfully",
        messages,
      });
    } catch (error) {
      res.status(500).send({
        status: 0,
        msg: "Failed to fetch conversation",
        error: error.message,
      });
    }
  }
);

// ==================== MARK MESSAGE AS READ ====================

router.put("/:id/read", async (req, res) => {
  try {
    const message =
      await MessageModel.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );

    if (!message) {
      return res.status(404).send({
        status: 0,
        msg: "Message not found",
      });
    }

    res.send({
      status: 1,
      msg: "Message marked as read",
      message,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to update message",
      error: error.message,
    });
  }
});

// ==================== DELETE MESSAGE ====================

router.delete("/:id", async (req, res) => {
  try {
    const message =
      await MessageModel.findByIdAndDelete(
        req.params.id
      );

    if (!message) {
      return res.status(404).send({
        status: 0,
        msg: "Message not found",
      });
    }

    res.send({
      status: 1,
      msg: "Message deleted successfully",
      deletedMessage: message,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to delete message",
      error: error.message,
    });
  }
});

module.exports = router;