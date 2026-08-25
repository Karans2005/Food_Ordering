const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserModel = require("../model/User.Model.js");
console.log("UserModel:", typeof UserModel);


const router = express.Router();

// ==================== REGISTER ====================

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
    } = req.body;

    // Required fields
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).send({
        status: 0,
        msg: "All fields are required",
      });
    }

    // Check password
    if (password !== confirmPassword) {
      return res.status(400).send({
        status: 0,
        msg: "Passwords do not match",
      });
    }

    // Check existing user
    const existingUser = await UserModel.findOne({
      email,
    });

    if (existingUser) {
      return res.status(400).send({
        status: 0,
        msg: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Create user
    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).send({
      status: 1,
      msg: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Registration failed",
      error: error.message,
    });
  }
});

// ==================== LOGIN ====================

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password,
    } = req.body;

    // Required fields
    if (!email || !password) {
      return res.status(400).send({
        status: 0,
        msg: "Email and password are required",
      });
    }

    // Find user
    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      return res.status(404).send({
        status: 0,
        msg: "User not found",
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).send({
        status: 0,
        msg: "Invalid email or password",
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.send({
      status: 1,
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).send({
      status: 0,
      msg: "Login failed",
      error: error.message,
    });
  }
});

module.exports = router;