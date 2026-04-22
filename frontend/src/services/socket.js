// frontend/src/services/socket.js
// Auto-reconnects every 5s — needed for Render's free tier cold starts

let socket       = null;
let reconnecting = false;
let retryTimer   = null;
let messageCallback = null;

export function connectSocket(onMessage) {
  messageCallback = onMessage;
  connect();
}

function connect() {
  // Use env variable in production, fallback to localhost in dev
  const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000";

  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }

  console.log(`🔌 Connecting to ${WS_URL}...`);
  socket = new WebSocket(WS_URL);

  socket.onopen = () => {
    console.log("🟢 WebSocket connected");
    reconnecting = false;
    if (retryTimer) {
      clearTimeout(retryTimer);
      retryTimer = null;
    }
  };

  socket.onmessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      if (message.type === "PORTFOLIO_UPDATE" && messageCallback) {
        messageCallback(message);   // full message — App.jsx reads message.prices
      }
    } catch (err) {
      console.error("❌ WebSocket parse error:", err);
    }
  };

  socket.onerror = () => {
    // Let onclose handle the retry
  };

  socket.onclose = () => {
    if (!reconnecting) {
      reconnecting = true;
      console.warn("🔴 WebSocket closed — retrying in 5s...");
    }
    retryTimer = setTimeout(connect, 5000);
  };
}

export function disconnectSocket() {
  if (retryTimer) {
    clearTimeout(retryTimer);
    retryTimer = null;
  }
  if (socket) {
    socket.onclose = null; // prevent auto-reconnect on manual close
    socket.close();
    socket = null;
  }
}
