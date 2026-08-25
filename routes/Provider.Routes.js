const express = require("express");
const ProviderModel = require("../model/Provider.Model.js");
const authMiddleware = require("../middleware/authMiddleware.js");

const router = express.Router();

// ==================== CREATE PROVIDER ====================

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      skills,
      experience,
      bio,
      available,
      profileImage,
    } = req.body;

    // JWT se logged-in user ki ID
    const userId = req.user.userId;

    if (!name || !skills || !experience) {
      return res.status(400).send({
        status: 0,
        msg: "name, skills and experience are required",
      });
    }

    const existingProvider = await ProviderModel.findOne({
      userId,
    });

    if (existingProvider) {
      return res.status(400).send({
        status: 0,
        msg: "Provider profile already exists",
      });
    }

    const provider = new ProviderModel({
      userId,
      name,
      skills,
      experience,
      bio: bio || "",
      available:
        available !== undefined ? available : true,
      profileImage: profileImage || "",
    });

    await provider.save();

    res.status(201).send({
      status: 1,
      msg: "Provider created successfully",
      provider,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to create provider",
      error: error.message,
    });
  }
});

// ==================== GET ALL PROVIDERS ====================

router.get("/", async (req, res) => {
  try {
    const providers = await ProviderModel.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.send({
      status: 1,
      msg: "Providers fetched successfully",
      providers,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch providers",
      error: error.message,
    });
  }
});

// ==================== GET SINGLE PROVIDER ====================

router.get("/:id", async (req, res) => {
  try {
    const provider = await ProviderModel.findById(
      req.params.id
    ).populate("userId", "name email");

    if (!provider) {
      return res.status(404).send({
        status: 0,
        msg: "Provider not found",
      });
    }

    res.send({
      status: 1,
      provider,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to fetch provider",
      error: error.message,
    });
  }
});

// ==================== UPDATE PROVIDER ====================

router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      skills,
      experience,
      bio,
      available,
      profileImage,
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (skills !== undefined) updateData.skills = skills;
    if (experience !== undefined) {
      updateData.experience = experience;
    }
    if (bio !== undefined) updateData.bio = bio;
    if (available !== undefined) {
      updateData.available = available;
    }
    if (profileImage !== undefined) {
      updateData.profileImage = profileImage;
    }

    const provider =
      await ProviderModel.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!provider) {
      return res.status(404).send({
        status: 0,
        msg: "Provider not found",
      });
    }

    res.send({
      status: 1,
      msg: "Provider updated successfully",
      provider,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to update provider",
      error: error.message,
    });
  }
});

// ==================== DELETE PROVIDER ====================

router.delete("/:id", async (req, res) => {
  try {
    const provider =
      await ProviderModel.findByIdAndDelete(
        req.params.id
      );

    if (!provider) {
      return res.status(404).send({
        status: 0,
        msg: "Provider not found",
      });
    }

    res.send({
      status: 1,
      msg: "Provider deleted successfully",
      deletedProvider: provider,
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Failed to delete provider",
      error: error.message,
    });
  }
});

module.exports = router;