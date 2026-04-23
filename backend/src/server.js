// backend/src/server.js

import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { initWebSocket } from "./websocket.js";

import authRoutes from "./routes/auth.js";
import holdingsRoutes from "./routes/holdings.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/my_profits";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("-----------------------------------------");
    console.log("✅ SYSTEM READY: Connected to MongoDB");
    console.log(`📡 URI: ${MONGODB_URI.split("@").pop()}`); // Don't show full URI with password
    console.log("-----------------------------------------");
  })
  .catch((err) => {
    console.log("-----------------------------------------");
    console.error("❌ CRITICAL: MongoDB connection error:", err.message);
    console.log("Please ensure MongoDB is running locally.");
    console.log("-----------------------------------------");
  });

app.get("/", (req, res) => {
  res.send("MY-PROFITS Backend Running 👑");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/holdings", holdingsRoutes);

// Health check for Render uptime monitors
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
