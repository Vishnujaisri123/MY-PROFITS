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

    // New users get sample demo holdings to explore the dashboard
    const sampleHoldings = {
      gold: [
        { id: 1, qty: 5,  buyPrice: 7500  },   // 5g @ ₹7,500/g
        { id: 2, qty: 10, buyPrice: 8200  },   // 10g @ ₹8,200/g
      ],
      silver: [
        { id: 1, qty: 1, buyPrice: 75000 },    // 1kg @ ₹75,000/kg
      ],
    };
    const user = new User({ username, password, holdings: sampleHoldings });
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
