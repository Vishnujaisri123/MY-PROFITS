import { useEffect, useState } from "react";
import { connectSocket } from "./services/socket";

import LiveRates from "./components/LiveRates";
import BuyHistory from "./components/BuyHistory";
import ArcReactor from "./components/ArcReactor";
import StateMarketFeed from "./components/StateMarketFeed";
import { calculateAPPortfolio } from "./utils/apPortfolio";
import { GOLD_AP_MULTIPLIER, SILVER_AP_MULTIPLIER } from "./utils/apConstants";

export default function App() {
  const [data, setData] = useState({ prices: {}, portfolio: {} });
  const [systemMode, setSystemMode] = useState(false);

  useEffect(() => {
    connectSocket(setData);
  }, []);

  /* ===============================
     LOADING STATE
     =============================== */
  if (
    !data.portfolio?.gold ||
    !data.portfolio?.silver ||
    !data.prices?.gold?.price
  ) {
    return <div style={styles.loading}>INITIALIZING SYSTEM…</div>;
  }

  /* ===============================
     AP STATE PRICE MULTIPLIERS
     Imported from apConstants.js — single source of truth
     =============================== */
  const apPrices = {
    gold: data.prices.gold.price * GOLD_AP_MULTIPLIER,
    silver: data.prices.silver.price * SILVER_AP_MULTIPLIER,
  };

  const apPortfolio = calculateAPPortfolio(data.portfolio, apPrices);

  return (
    <div className="theme-gold" style={styles.container}>
      {/* 🌌 SYSTEM MODE (FULL SCREEN) */}
      {systemMode ? (
        <div style={styles.systemMode} onClick={() => setSystemMode(false)}>
          <ArcReactor portfolio={data.portfolio} apPortfolio={apPortfolio} />
        </div>
      ) : (
        <>
          {/* LEFT – LIVE FEED */}
          <div style={styles.left}>
            <div className="glass">
              <LiveRates prices={data.prices} />
            </div>
            <div style={{ marginTop: "auto" }}>
              <StateMarketFeed prices={data.prices} />
            </div>
          </div>

          {/* CENTER – ARC REACTOR */}
          <div style={styles.center}>
            <div style={styles.reactorWrapper}>
              <ArcReactor
                portfolio={data.portfolio}
                apPortfolio={apPortfolio}
                onSystemMode={() => setSystemMode(true)}
              />
            </div>
          </div>

          {/* RIGHT – PORTFOLIOS */}
          <div style={styles.right}>
            <BuyHistory
              title="GOLD"
              unit="g"
              data={data.portfolio.gold}
              prices={data.prices}
            />
            <BuyHistory
              title="SILVER"
              unit="kg"
              data={data.portfolio.silver}
              prices={data.prices}
            />

          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 2fr",
    height: "100vh",
    gap: "20px",
    padding: "20px",
    background: "radial-gradient(circle at top, #050b14, #000)",
    color: "#e6ffff",
    fontFamily: "Orbitron, Arial",
    overflow: "hidden",
  },
  left: {
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    zIndex: 1,
    transition: "opacity 0.4s ease",
  },
  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  reactorWrapper: {
    cursor: "pointer",
    transition: "transform 0.4s ease",
  },
  right: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    overflowY: "auto",
    overflowX: "hidden",
    zIndex: 1,
    transition: "opacity 0.4s ease",
  },
  systemMode: {
    gridColumn: "1 / -1",
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at center, #07162d, #02060d)",
    cursor: "pointer",
  },
  loading: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(circle at top, #050b14, #000)",
    color: "#00ffe1",
    fontSize: "20px",
    letterSpacing: "2px",
    fontFamily: "Orbitron, Arial",
  },
};
