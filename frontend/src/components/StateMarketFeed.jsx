// export default function StateMarketFeed({ prices }) {
//   // Global spot
//   const goldSpot = prices.gold?.price || 0;
//   const silverSpot = prices.silver?.price || 0;

//   /* ===============================
//      AP STATE MULTIPLIERS
//      =============================== */
//   // Derived from your given values
//   const GOLD_AP_MULTIPLIER = 15780 / 13959.89; // ≈ 1.185
//   const SILVER_AP_MULTIPLIER = 299350 / 229473.38; // ≈ 1.197

//   const goldAP = goldSpot * GOLD_AP_MULTIPLIER;
//   const silverAP = silverSpot * SILVER_AP_MULTIPLIER;

//   return (
//     <div style={styles.card} className="glass">
//       <h3 style={styles.title}>AP STATE MARKET</h3>

//       <div style={styles.row}>
//         <span>Gold (₹/g)</span>
//         <strong>₹ {goldAP.toFixed(0)}</strong>
//       </div>

//       <div style={styles.row}>
//         <span>Silver (₹/kg)</span>
//         <strong>₹ {silverAP.toFixed(0)}</strong>
//       </div>

//       <div style={styles.note}>Market-adjusted • Andhra Pradesh</div>
//     </div>
//   );
// }

// const styles = {
//   card: {
//     marginTop: "16px",
//     padding: "16px",
//     borderRadius: "12px",
//     background: "rgba(0,0,0,0.55)",
//     border: "1px solid rgba(255,215,100,0.35)",
//   },
//   title: {
//     fontSize: "12px",
//     letterSpacing: "2px",
//     marginBottom: "12px",
//     color: "var(--hud-primary)",
//     fontFamily: "Orbitron, Arial",
//   },
//   row: {
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: "10px",
//     fontSize: "14px",
//     color: "var(--hud-white)",
//   },
//   note: {
//     marginTop: "10px",
//     fontSize: "10px",
//     opacity: 0.7,
//     letterSpacing: "1px",
//   },
// };
import { useRef, useEffect, useState } from "react";
import { GOLD_AP_MULTIPLIER, SILVER_AP_MULTIPLIER } from "../utils/apConstants";

export default function StateMarketFeed({ prices }) {
  // Use SPOT price as base — AP multipliers are calibrated against spot
  const goldSpot   = prices.gold?.spot   || 0;
  const silverSpot = prices.silver?.spot || 0;

  const goldAP   = goldSpot   * GOLD_AP_MULTIPLIER;
  const silverAP = silverSpot * SILVER_AP_MULTIPLIER;

  const [goldDir, setGoldDir] = useState("same");
  const [silverDir, setSilverDir] = useState("same");

  /* ── track direction (up / down / same) without re-renders ── */
  const prevGold   = useRef(null);
  const prevSilver = useRef(null);

  useEffect(() => {
    if (prevGold.current !== null) {
      if (goldAP > prevGold.current) setGoldDir("up");
      else if (goldAP < prevGold.current) setGoldDir("down");
      else setGoldDir("same");
    }

    if (prevSilver.current !== null) {
      if (silverAP > prevSilver.current) setSilverDir("up");
      else if (silverAP < prevSilver.current) setSilverDir("down");
      else setSilverDir("same");
    }

    prevGold.current   = goldAP;
    prevSilver.current = silverAP;
  }, [goldAP, silverAP]);

  return (
    <div className="glass" style={styles.container}>
      <h3 style={styles.title}>AP STATE MARKET</h3>

      <APRateRow label="GOLD (AP)"   sub="₹ / gram" price={goldAP}   direction={goldDir}   accent="#ffd36a" />
      <APRateRow label="SILVER (AP)" sub="₹ / kg"   price={silverAP} direction={silverDir} accent="#b0c8ff" />

      <div style={styles.note}>Market-adjusted • Andhra Pradesh</div>
    </div>
  );
}

/* ── colored rate row ── */
function APRateRow({ label, sub, price, direction, accent }) {
  const priceColor =
    direction === "up"
      ? "#00ffe1"   // cyan  ↑
      : direction === "down"
      ? "#ff4d4d"   // red   ↓
      : accent;     // metal tint when neutral

  const arrow =
    direction === "up"   ? " ▲"
    : direction === "down" ? " ▼"
    : "";

  return (
    <div
      style={{
        ...styles.row,
        borderColor: direction === "up"
          ? "rgba(0,255,225,0.35)"
          : direction === "down"
          ? "rgba(255,77,77,0.35)"
          : "rgba(255,215,100,0.25)",
        boxShadow: direction === "up"
          ? "0 0 10px rgba(0,255,225,0.12)"
          : direction === "down"
          ? "0 0 10px rgba(255,77,77,0.12)"
          : "none",
      }}
    >
      <div>
        <div style={styles.label}>{label}</div>
        <div style={styles.sub}>{sub}</div>
      </div>
      <div style={{ ...styles.price, color: priceColor }}>
        ₹ {price.toFixed(0)}
        <span style={styles.arrow}>{arrow}</span>
      </div>
    </div>
  );
}

/* ===============================
   SAME STYLE AS LIVE METAL FEED
   =============================== */

const styles = {
  container: {
    marginTop: "16px",
    padding: "16px",
  },

  title: {
    fontSize: "12px",
    letterSpacing: "2px",
    marginBottom: "14px",
    color: "var(--hud-primary)",
    fontFamily: "Orbitron, Arial",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "10px",
    background: "rgba(0, 30, 60, 0.6)",
    border: "1px solid",                  // color set dynamically per row
    transition: "border-color 0.4s ease, box-shadow 0.4s ease",
  },

  label: {
    fontSize: "12px",
    letterSpacing: "1.5px",
    color: "var(--hud-secondary)",
    fontFamily: "Inter, Arial",
  },

  sub: {
    fontSize: "10px",
    opacity: 0.6,
    letterSpacing: "1px",
  },

  price: {
    fontSize: "18px",
    fontFamily: "Orbitron, Arial",
    transition: "color 0.3s ease",
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },

  arrow: {
    fontSize: "12px",
    fontFamily: "Inter, Arial",
    opacity: 0.9,
  },

  note: {
    marginTop: "8px",
    fontSize: "10px",
    letterSpacing: "1px",
    opacity: 0.65,
  },
};
