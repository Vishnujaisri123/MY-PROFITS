import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
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

// ─── Guest prompt shown instead of portfolio when not logged in ──────────────
function GuestPortfolioPrompt() {
  const navigate = useNavigate();
  return (
    <div className="glass" style={guestStyles.card}>
      <div style={guestStyles.icon}>🔐</div>
      <h3 style={guestStyles.title}>TRACK YOUR PORTFOLIO</h3>
      <p style={guestStyles.sub}>
        Sign in or create an account to track your gold &amp; silver holdings,
        monitor P&amp;L, and sync data across all your devices.
      </p>
      <div style={guestStyles.btnRow}>
        <button onClick={() => navigate("/login")}  style={guestStyles.btnPrimary}>SIGN IN</button>
        <button onClick={() => navigate("/signup")} style={guestStyles.btnSecondary}>CREATE ACCOUNT</button>
      </div>
    </div>
  );
}

const guestStyles = {
  card: {
    padding: "32px 24px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
    marginBottom: "16px",
  },
  icon: { fontSize: "36px" },
  title: {
    fontFamily: "Orbitron, sans-serif",
    fontSize: "14px",
    letterSpacing: "3px",
    color: "var(--hud-primary)",
    margin: 0,
  },
  sub: {
    fontSize: "12px",
    opacity: 0.65,
    lineHeight: 1.7,
    maxWidth: "280px",
    margin: 0,
  },
  btnRow: { display: "flex", gap: "12px", marginTop: "8px" },
  btnPrimary: {
    padding: "10px 20px",
    background: "rgba(0,255,225,0.1)",
    border: "1px solid var(--neon)",
    color: "var(--neon)",
    fontFamily: "Orbitron, sans-serif",
    fontSize: "11px",
    letterSpacing: "1.5px",
    cursor: "pointer",
    borderRadius: "6px",
  },
  btnSecondary: {
    padding: "10px 20px",
    background: "rgba(255,211,106,0.1)",
    border: "1px solid var(--hud-primary)",
    color: "var(--hud-primary)",
    fontFamily: "Orbitron, sans-serif",
    fontSize: "11px",
    letterSpacing: "1.5px",
    cursor: "pointer",
    borderRadius: "6px",
  },
};

// ─── Main App ────────────────────────────────────────────────────────────────
function MainApp() {
  const [prices, setPrices]     = useState({});
  const [systemMode, setSystemMode] = useState(false);
  const { user, logout, token, loading } = useAuth();

  const { holdings, updateBuy, addBuy, deleteBuy } = usePortfolioEditor();

  useEffect(() => {
    connectSocket((msg) => {
      if (msg.prices) setPrices(msg.prices);
    });
  }, []);

  // While checking stored token/session
  if (loading) {
    return <div className="app-loading">ESTABLISHING SECURE LINK…</div>;
  }

  // Wait for first price tick
  if (!prices.gold?.price || !prices.silver?.price) {
    return <div className="app-loading">INITIALIZING SYSTEM…</div>;
  }

  /* ── Portfolio calculations (only meaningful when logged in) ── */
  const emptyHoldings    = { gold: [], silver: [] };
  const activeHoldings   = token ? holdings : emptyHoldings;

  const goldPortfolio    = calcPortfolio(activeHoldings.gold,   prices.gold.price);
  const silverPortfolio  = calcPortfolio(activeHoldings.silver, prices.silver.price);

  const apPrices = {
    gold:   prices.gold.spot   * GOLD_AP_MULTIPLIER,
    silver: prices.silver.spot * SILVER_AP_MULTIPLIER,
  };
  const combined = { gold: goldPortfolio, silver: silverPortfolio };
  const apPortfolio = calculateAPPortfolio(combined, apPrices);

  return (
    <div className="theme-gold app-grid">

      {/* HUD Header */}
      <div style={styles.hudHeader}>
        <div style={styles.userSection}>
          <span style={styles.userLabel}>OPERATOR:</span>
          <span style={styles.userName}>
            {token ? (user?.username?.toUpperCase() || "UNKNOWN") : "GUEST"}
          </span>
        </div>

        <div style={styles.headerRight}>
          {token ? (
            <button onClick={logout} style={styles.logoutBtn}>TERMINATE SESSION</button>
          ) : (
            <div style={styles.guestBtnRow}>
              <a href="/login"  style={styles.loginLink}>SIGN IN</a>
              <a href="/signup" style={styles.signupLink}>REGISTER</a>
            </div>
          )}
        </div>
      </div>

      {systemMode ? (
        <div className="app-system-mode" onClick={() => setSystemMode(false)}>
          <ArcReactor portfolio={combined} apPortfolio={apPortfolio} />
        </div>
      ) : (
        <>
          {/* LEFT — live rates (always visible) */}
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

          {/* RIGHT — portfolio (login prompt if not authenticated) */}
          <div className="app-right">
            {token ? (
              <>
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
              </>
            ) : (
              <GuestPortfolioPrompt />
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  hudHeader: {
    position: "fixed",
    top: 0, left: 0,
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
  userSection: { display: "flex", alignItems: "center", gap: "12px" },
  userLabel:   { fontSize: "10px", letterSpacing: "2px", opacity: 0.6, fontFamily: "Inter, sans-serif" },
  userName:    { fontSize: "13px", letterSpacing: "2px", color: "var(--neon)", fontWeight: "bold", fontFamily: "Orbitron, sans-serif" },
  headerRight: { display: "flex", alignItems: "center", gap: "12px" },
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
  },
  guestBtnRow: { display: "flex", gap: "10px" },
  loginLink: {
    padding: "6px 14px",
    background: "rgba(0,255,225,0.08)",
    border: "1px solid var(--neon)",
    color: "var(--neon)",
    fontFamily: "Orbitron, sans-serif",
    fontSize: "10px",
    letterSpacing: "1.5px",
    borderRadius: "6px",
    textDecoration: "none",
  },
  signupLink: {
    padding: "6px 14px",
    background: "rgba(255,211,106,0.08)",
    border: "1px solid var(--hud-primary)",
    color: "var(--hud-primary)",
    fontFamily: "Orbitron, sans-serif",
    fontSize: "10px",
    letterSpacing: "1.5px",
    borderRadius: "6px",
    textDecoration: "none",
  },
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"  element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/"       element={<MainApp />} />
          <Route path="*"       element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
