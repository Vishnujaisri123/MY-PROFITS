// // frontend/src/components/LiveRates.jsx

// export default function LiveRates({ prices }) {
//   return (
//     <div style={styles.card}>
//       <h3 style={styles.title}>Live Rates</h3>

//       <div style={getRowStyle(prices.gold?.direction)}>
//         <span>Gold</span>
//         <span>₹ {prices.gold?.price}</span>
//       </div>

//       <div style={getRowStyle(prices.silver?.direction)}>
//         <span>Silver</span>
//         <span>₹ {prices.silver?.price}</span>
//       </div>
//     </div>
//   );
// }

// function getRowStyle(direction) {
//   return {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "12px",
//     marginTop: "8px",
//     borderRadius: "6px",
//     background: "#111",
//     color:
//       direction === "up"
//         ? "#00ff6a"
//         : direction === "down"
//         ? "#ff3b3b"
//         : "#fff",
//     fontSize: "18px"
//   };
// }

// const styles = {
//   card: {
//     border: "1px solid #222",
//     padding: "15px",
//     borderRadius: "10px",
//     background: "#0b0b0b",
//     marginBottom: "20px"
//   },
//   title: {
//     marginBottom: "10px",
//     color: "#aaa"
//   }
// };
// frontend/src/components/LiveRates.jsx

// export default function LiveRates({ prices }) {
//   return (
//     <div style={styles.card}>
//       <h2 style={styles.title}>LIVE METAL FEED</h2>

//       <div style={rateStyle(prices.gold?.direction)}>
//         <span>GOLD</span>
//         <span>₹ {prices.gold?.price}</span>
//       </div>

//       <div style={rateStyle(prices.silver?.direction)}>
//         <span>SILVER</span>
//         <span>₹ {prices.silver?.price}</span>
//       </div>
//     </div>
//   );
// }

// function rateStyle(direction) {
//   return {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "14px",
//     marginTop: "15px",
//     border: "1px solid rgba(0,255,255,0.4)",
//     borderRadius: "8px",
//     background: "rgba(0, 20, 40, 0.6)",
//     color:
//       direction === "up"
//         ? "#00ffe1"
//         : direction === "down"
//         ? "#ff4d4d"
//         : "#ffffff",
//     boxShadow: "0 0 15px rgba(0,255,255,0.2)"
//   };
// }

// const styles = {
//   card: {
//     height: "100%",
//     padding: "20px",
//     borderRadius: "12px",
//     background: "rgba(0,0,0,0.6)",
//     backdropFilter: "blur(10px)",
//     border: "1px solid rgba(0,255,255,0.25)"
//   },
//   title: {
//     color: "#00ffe1",
//     letterSpacing: "2px",
//     marginBottom: "20px"
//   }
// };
// frontend/src/components/LiveRates.jsx
// frontend/src/components/LiveRates.jsx

export default function LiveRates({ prices }) {
  return (
    <div className="glass" style={styles.card}>
      <h2 style={styles.title}>LIVE METAL FEED</h2>

      <RateRow
        label="GOLD (g)"
        price={prices.gold?.price}
        direction={prices.gold?.direction}
      />

      <RateRow
        label="SILVER (1kg)"
        price={prices.silver?.price}
        direction={prices.silver?.direction}
      />
    </div>
  );
}

function RateRow({ label, price, direction }) {
  const priceColor =
    direction === "up"
      ? "#00ffe1" // green / cyan
      : direction === "down"
        ? "#ff4d4d" // red
        : "#e6ffff"; // neutral

  return (
    <div style={styles.row}>
      {/* NAME — ALWAYS NEUTRAL */}
      <span style={styles.label}>{label}</span>

      {/* PRICE — COLOR CHANGES */}
      <strong
        style={{
          ...styles.price,
          color: priceColor,
        }}
      >
        ₹ {price}
      </strong>
    </div>
  );
}

/* ===============================
   STYLES
   =============================== */

const styles = {
  card: {
    padding: "20px",
    borderRadius: "14px",
    background: "rgba(0,0,0,0.65)",
    border: "1px solid rgba(0,255,255,0.25)",
  },

  title: {
    color: "#e6ffff", // neutral title
    letterSpacing: "2px",
    marginBottom: "22px",
    fontSize: "16px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px",
    marginBottom: "14px",
    borderRadius: "10px",
    background: "rgba(0, 30, 60, 0.6)",
    border: "1px solid rgba(0,255,255,0.2)",
  },

  price: {
    fontFamily: "Orbitron, Arial",
    fontSize: "20px",
    color: "var(--hud-primary)",
  },

  label: {
    fontFamily: "Inter, Arial",
    fontSize: "11px",
    letterSpacing: "1.5px",
    color: "var(--hud-muted)",
  },
};
