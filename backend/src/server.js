// backend/src/server.js

import express from "express";
import http from "http";
import cors from "cors";
import { initWebSocket } from "./websocket.js";

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());               // allow all origins (WebSocket handles its own)
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MY-PROFITS Backend Running 👑");
});

// Health check for Render uptime monitors
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const server = http.createServer(app);
initWebSocket(server);

server.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
