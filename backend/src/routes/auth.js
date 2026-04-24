import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  console.log(`Registration attempt for operator: ${req.body.username}`);
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // New users start with empty holdings — they add their own data
    const user = new User({ username, password, holdings: { gold: [], silver: [] } });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "jarvis_secret_key", { expiresIn: "7d" });
    res.status(201).json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log(`Login attempt for operator: ${req.body.username}`);
  try {
    const username = req.body.username?.trim();
    const password = req.body.password;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "jarvis_secret_key", { expiresIn: "7d" });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
