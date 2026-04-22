// // frontend/src/components/ProfitPanel.jsx

// import { useState } from "react";

// export default function ProfitPanel({ prices }) {
//   const [goldBuy, setGoldBuy] = useState(5500);
//   const [goldQty, setGoldQty] = useState(10);

//   const [silverBuy, setSilverBuy] = useState(115);
//   const [silverQty, setSilverQty] = useState(1);

//   const goldLive = prices.gold?.price || 0;
//   const silverLive = prices.silver?.price || 0;

//   const goldProfit = ((goldLive - goldBuy) * goldQty).toFixed(2);
//   const silverProfit = ((silverLive - silverBuy) * silverQty).toFixed(2);

//   return (
//     <>
//       {/* GOLD */}
//       <div style={styles.card}>
//         <h3>Gold Holding</h3>

//         <input
//           type="number"
//           placeholder="Buy Price"
//           value={goldBuy}
//           onChange={e => setGoldBuy(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Quantity (g)"
//           value={goldQty}
//           onChange={e => setGoldQty(e.target.value)}
//         />

//         <div style={profitStyle(goldProfit)}>
//           Profit: ₹ {goldProfit}
//         </div>
//       </div>

//       {/* SILVER */}
//       <div style={styles.card}>
//         <h3>Silver Holding</h3>

//         <input
//           type="number"
//           placeholder="Buy Price"
//           value={silverBuy}
//           onChange={e => setSilverBuy(e.target.value)}
//         />
//         <input
//           type="number"
//           placeholder="Quantity"
//           value={silverQty}
//           onChange={e => setSilverQty(e.target.value)}
//         />

//         <div style={profitStyle(silverProfit)}>
//           Profit: ₹ {silverProfit}
//         </div>
//       </div>
//     </>
//   );
// }

// function profitStyle(value) {
//   return {
//     marginTop: "10px",
//     fontSize: "18px",
//     color: value >= 0 ? "#00ff6a" : "#ff3b3b"
//   };
// }

// const styles = {
//   card: {
//     border: "1px solid #222",
//     padding: "15px",
//     borderRadius: "10px",
//     background: "#0b0b0b",
//     marginBottom: "20px",
//     color: "#fff"
//   }
// };
// frontend/src/components/ProfitPanel.jsx

// frontend/src/components/ProfitPanel.jsx

// frontend/src/components/ProfitPanel.jsx

// export default function ProfitPanel({ prices }) {
//   /* ===============================
//      SYSTEM-CONFIGURED BUY DETAILS
//      (Later we’ll load these from backend / settings panel)
//      =============================== */

//   // Gold → price per 10 grams
//   const goldBuy = 64000; // ₹ / 10g
//   const goldQty = 10; // 2 × 10g = 20g

//   // Silver → price per 1 KG
//   const silverBuy = 80000; // ₹ / 1kg
//   const silverQty = 1; // 1kg

//   /* ===============================
//      LIVE PRICES (from WebSocket)
//      =============================== */

//   const goldLive = prices.gold?.price || 0; // ₹ / 10g
//   const silverLive = prices.silver?.price || 0; // ₹ / 1kg

//   /* ===============================
//      PROFIT / LOSS CALCULATION
//      =============================== */

//   const goldDiff = (goldLive - goldBuy) * goldQty;
//   const silverDiff = (silverLive - silverBuy) * silverQty;

//   return (
//     <div style={styles.card}>
//       <h2 style={styles.title}>PROFIT / LOSS ENGINE</h2>

//       <HudBlock label="GOLD (10g)" diff={goldDiff} />

//       <HudBlock label="SILVER (1kg)" diff={silverDiff} />
//     </div>
//   );
// }

// /* ===============================
//    HUD BLOCK COMPONENT
//    =============================== */

// function HudBlock({ label, diff }) {
//   const isProfit = diff >= 0;
//   const color = isProfit ? "#00ffe1" : "#ff4d4d";

//   return (
//     <div style={{ ...styles.block, borderColor: color }}>
//       <span>{label}</span>
//       <strong style={{ color }}>
//         {isProfit ? "PROFIT" : "LOSS"} ₹ {Math.abs(diff).toFixed(2)}
//       </strong>
//     </div>
//   );
// }

// /* ===============================
//    STYLES (IRON-MAN HUD)
//    =============================== */

// const styles = {
//   card: {
//     height: "100%",
//     padding: "20px",
//     borderRadius: "12px",
//     background: "rgba(0,0,0,0.6)",
//     backdropFilter: "blur(10px)",
//     border: "1px solid rgba(0,255,255,0.25)",
//   },
//   title: {
//     color: "#00ffe1",
//     letterSpacing: "2px",
//     marginBottom: "25px",
//   },
//   block: {
//     padding: "18px",
//     marginBottom: "20px",
//     border: "1px solid",
//     borderRadius: "10px",
//     background: "rgba(0, 30, 60, 0.6)",
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: "18px",
//     boxShadow: "0 0 20px rgba(0,255,255,0.15)",
//   },
// };
// frontend/src/components/ProfitPanel.jsx

export default function ProfitPanel({ portfolio }) {
  if (!portfolio || !portfolio.gold || !portfolio.silver) return null;

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>PROFIT / LOSS ENGINE</h2>

      <HudBlock label="GOLD" unit="grams" data={portfolio.gold} />
      <HudBlock label="SILVER" unit="kg" data={portfolio.silver} />
    </div>
  );
}

/* ===============================
   HUD BLOCK (SINGLE METAL)
   =============================== */

function HudBlock({ label, data }) {
  const isProfit = data.profit >= 0;

  return (
    <div
      className={`glow ${isProfit ? "pulse-profit" : "pulse-loss"}`}
      style={{
        ...styles.block,
        borderColor: isProfit ? "#00ffe1" : "#ff4d4d",
      }}
    >
      <span>{label}</span>
      <strong style={{ color: isProfit ? "#00ffe1" : "#ff4d4d" }}>
        {isProfit ? "PROFIT" : "LOSS"} ₹ {Math.abs(data.profit).toFixed(0)}
      </strong>
    </div>
  );
}

/* ===============================
   STYLES — IRON-MAN HUD
   =============================== */

const styles = {
  card: {
    height: "100%",
    padding: "20px",
    borderRadius: "12px",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(0,255,255,0.25)",
  },

  title: {
    color: "#00ffe1",
    letterSpacing: "2px",
    marginBottom: "25px",
    textAlign: "center",
  },

  block: {
    padding: "18px",
    marginBottom: "20px",
    border: "1px solid",
    borderRadius: "10px",
    background: "rgba(0, 30, 60, 0.6)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "16px",
    boxShadow: "0 0 20px rgba(0,255,255,0.15)",
  },

  metal: {
    fontSize: "18px",
    letterSpacing: "1px",
    color: "#00ffe1",
  },

  text: {
    margin: "4px 0",
    color: "#ccc",
    fontSize: "14px",
  },

  pnl: {
    fontSize: "18px",
    textAlign: "right",
    letterSpacing: "1px",
  },
};
