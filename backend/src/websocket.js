import { WebSocketServer } from "ws";
import { fetchLivePrices } from "./priceService.js";
import { computePortfolio } from "./portfolioService.js";
import { CONFIG } from "./config.js";

export function initWebSocket(server) {
  const wss = new WebSocketServer({ server });

  console.log("WebSocket server started");

  wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  setInterval(async () => {
    try {
      // 1️⃣ Fetch live metal prices
      const prices = await fetchLivePrices();
      if (!prices) return;

      // 2️⃣ Compute portfolio P/L (backend = source of truth)
      const portfolio = computePortfolio(prices);

      // 3️⃣ Unified payload (prices + portfolio)
      const payload = JSON.stringify({
        type: "PORTFOLIO_UPDATE",
        prices,
        portfolio,
      });

      // 4️⃣ Broadcast to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(payload);
        }
      });
    } catch (err) {
      console.error("WebSocket loop error:", err.message);
    }
  }, CONFIG.PRICE_UPDATE_INTERVAL);
}
