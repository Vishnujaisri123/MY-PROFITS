import express from "express";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get user holdings
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user.holdings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user holdings
router.put("/", auth, async (req, res) => {
  try {
    const { holdings } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { holdings },
      { new: true }
    );
    res.json(user.holdings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
