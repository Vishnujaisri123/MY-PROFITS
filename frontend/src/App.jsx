import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { connectSocket } from "./services/socket";

import LiveRates from "./components/LiveRates";
import BuyHistory from "./components/BuyHistory";
import ArcReactor from "./components/ArcReactor";
import StateMarketFeed from "./components/StateMarketFeed";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { calcPortfolio } from "./utils/calcPortfolio";
import { calculateAPPortfolio } from "./utils/apPortfolio";
import { GOLD_AP_MULTIPLIER, SILVER_AP_MULTIPLIER } from "./utils/apConstants";
import { usePortfolioEditor } from "./hooks/usePortfolioEditor";

function MainApp() {
  const [prices, setPrices] = useState({});
  const [systemMode, setSystemMode] = useState(false);
  const { user, logout, token, loading } = useAuth();

  // Custom editable holdings (synced with API)
  const { holdings, updateBuy, addBuy, deleteBuy } = usePortfolioEditor();

  useEffect(() => {
    connectSocket((msg) => {
      if (msg.prices) setPrices(msg.prices);
    });
  }, []);

  // Show nothing or a loader while session is being established
  if (loading) {
    return <div className="app-loading">ESTABLISHING SECURE LINK…</div>;
  }

  // Redirect to login if no token
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  /* Loading */
  if (!prices.gold?.price || !prices.silver?.price) {
    return <div className="app-loading">INITIALIZING SYSTEM…</div>;
  }

  /* ── Compute SPOT portfolios locally from holdings + live prices ── */
  const goldPortfolio   = calcPortfolio(holdings.gold,   prices.gold.price);
  const silverPortfolio = calcPortfolio(holdings.silver, prices.silver.price);

  /* ── AP market portfolios ─────────────────────────────────────── */
  const apPrices = {
    gold:   prices.gold.price   * GOLD_AP_MULTIPLIER,
    silver: prices.silver.price * SILVER_AP_MULTIPLIER,
  };
  const combined = {
    gold:   goldPortfolio,
    silver: silverPortfolio,
  };
  const apPortfolio = calculateAPPortfolio(combined, apPrices);

  return (
    <div className="theme-gold app-grid">
      {/* HUD Header with User Info & Logout */}
      <div style={styles.hudHeader}>
        <div style={styles.userSection}>
          <span style={styles.userLabel}>OPERATOR:</span>
          <span style={styles.userName}>{user?.username?.toUpperCase() || "UNKNOWN"}</span>
        </div>
        <button onClick={logout} style={styles.logoutBtn}>TERMINATE SESSION</button>
      </div>

      {systemMode ? (
        <div className="app-system-mode" onClick={() => setSystemMode(false)}>
          <ArcReactor portfolio={combined} apPortfolio={apPortfolio} />
        </div>
      ) : (
        <>
          {/* LEFT — live rates */}
          <div className="app-left">
            <div className="glass">
              <LiveRates prices={prices} />
            </div>
            <StateMarketFeed prices={prices} />
          </div>

          {/* CENTER — arc reactor */}
          <div className="app-center">
            <ArcReactor
              portfolio={combined}
              apPortfolio={apPortfolio}
              onSystemMode={() => setSystemMode(true)}
            />
          </div>

          {/* RIGHT — editable portfolio cards */}
          <div className="app-right">
            <BuyHistory
              title="GOLD"
              unit="g"
              data={goldPortfolio}
              prices={prices}
              holdings={holdings.gold}
              onUpdate={(id, field, val) => updateBuy("gold",   id, field, val)}
              onAdd={()                  => addBuy("gold")}
              onDelete={(id)             => deleteBuy("gold",   id)}
            />
            <BuyHistory
              title="SILVER"
              unit="kg"
              data={silverPortfolio}
              prices={prices}
              holdings={holdings.silver}
              onUpdate={(id, field, val) => updateBuy("silver", id, field, val)}
              onAdd={()                  => addBuy("silver")}
              onDelete={(id)             => deleteBuy("silver", id)}
            />
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  hudHeader: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    padding: "15px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    background: "rgba(2, 6, 13, 0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0, 255, 225, 0.15)",
    boxSizing: "border-box",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userLabel: {
    fontSize: "10px",
    letterSpacing: "2px",
    opacity: 0.6,
    fontFamily: "Inter, sans-serif",
  },
  userName: {
    fontSize: "13px",
    letterSpacing: "2px",
    color: "var(--neon)",
    fontWeight: "bold",
    fontFamily: "Orbitron, sans-serif",
  },
  logoutBtn: {
    background: "rgba(255, 77, 77, 0.1)",
    border: "1px solid var(--danger)",
    color: "var(--danger)",
    borderRadius: "6px",
    padding: "6px 14px",
    fontSize: "10px",
    letterSpacing: "1.5px",
    cursor: "pointer",
    fontFamily: "Orbitron, sans-serif",
    transition: "all 0.3s ease",
  }
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<MainApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
