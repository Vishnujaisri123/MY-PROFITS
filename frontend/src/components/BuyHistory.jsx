//  import { useState } from "react";

// export default function BuyHistory({ title, unit, data }) {
//   const [cardFlip, setCardFlip] = useState(false);
//   const [summaryFlip, setSummaryFlip] = useState(false);

//   const isTotalProfit = data.totalProfit >= 0;

//   return (
//     <div>
//       {/* ================= PORTFOLIO CARD (FLIP) ================= */}
//       <div style={styles.scene} onClick={() => setCardFlip(!cardFlip)}>
//         <div
//           className="glass"
//           style={{
//             ...styles.card,
//             transform: cardFlip ? "rotateY(180deg)" : "rotateY(0deg)",
//           }}
//         >
//           {/* FRONT */}
//           <div style={styles.face}>
//             <h2 className="neon" style={styles.title}>
//               {title} PORTFOLIO
//             </h2>

//             {data.buyDetails.map((buy, index) => {
//               const isProfit = buy.profit >= 0;

//               return (
//                 <div
//                   key={index}
//                   className={`glass ${
//                     isProfit ? "pulse-profit" : "pulse-loss"
//                   }`}
//                   style={{
//                     ...styles.row,
//                     borderColor: isProfit ? "#00ffe1" : "#ff4d4d",
//                   }}
//                 >
//                   <div>
//                     <div style={styles.text}>
//                       Qty: {buy.qty} {unit}
//                     </div>
//                     <div style={styles.subText}>Buy @ ₹ {buy.buyPrice}</div>
//                   </div>

//                   <div style={{ textAlign: "right" }}>
//                     <div style={styles.subText}>
//                       {isProfit ? "PROFIT" : "LOSS"}
//                     </div>
//                     <strong
//                       style={{
//                         color: isProfit ? "#00ffe1" : "#ff4d4d",
//                         fontSize: "16px",
//                       }}
//                     >
//                       ₹ {Math.abs(buy.profit).toFixed(0)}
//                     </strong>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* BACK */}
//           <div style={{ ...styles.face, ...styles.back }}>
//             <div style={styles.flipHint}>TAP TO RETURN</div>
//           </div>
//         </div>
//       </div>

//       {/* ================= SUMMARY SECTION (FLIP) ================= */}
//       <div style={styles.scene} onClick={() => setSummaryFlip(!summaryFlip)}>
//         <div
//           className="glass"
//           style={{
//             ...styles.summaryBox,
//             transform: summaryFlip ? "rotateX(180deg)" : "rotateX(0deg)",
//           }}
//         >
//           {/* FRONT – SUMMARY NUMBERS */}
//           <div style={styles.face}>
//             <div style={styles.summaryRow}>
//               <span>Total Qty</span>
//               <span>
//                 {data.totalQty} {unit}
//               </span>
//             </div>

//             <div style={styles.summaryRow}>
//               <span>Avg Buy</span>
//               <span>₹ {data.avgBuy.toFixed(2)}</span>
//             </div>

//             <div style={styles.summaryRow}>
//               <span>Total Cost</span>
//               <span>₹ {data.totalCost.toFixed(0)}</span>
//             </div>

//             <div style={styles.summaryRow}>
//               <span>Current Value</span>
//               <span>₹ {data.totalValue.toFixed(0)}</span>
//             </div>

//             <div
//               style={{
//                 ...styles.totalProfit,
//                 color: isTotalProfit ? "#00ffe1" : "#ff4d4d",
//               }}
//             >
//               TOTAL {isTotalProfit ? "PROFIT" : "LOSS"} ₹{" "}
//               {Math.abs(data.totalProfit).toFixed(0)}
//             </div>
//           </div>

//           {/* BACK – DETAIL VIEW */}
//           <div style={{ ...styles.face, ...styles.back }}>
//             <div style={styles.detailBox}>
//               <div>{title} HOLDINGS</div>
//               <div>
//                 {data.totalQty} {unit}
//               </div>
//               <div style={styles.flipHint}>TAP TO RETURN</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ===============================
//    STYLES
//    =============================== */

// const styles = {
//   scene: {
//     perspective: "1200px",
//     cursor: "pointer",
//   },

//   face: {
//     backfaceVisibility: "hidden",
//   },

//   back: {
//     position: "absolute",
//     inset: 0,
//     transform: "rotateY(180deg)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   card: {
//     position: "relative",
//     padding: "22px",
//     borderRadius: "16px",
//     marginBottom: "14px",
//     transformStyle: "preserve-3d",
//     transition: "transform 0.8s cubic-bezier(.4,.2,.2,1)",
//   },

//   summaryBox: {
//     position: "relative",
//     padding: "18px",
//     borderRadius: "14px",
//     marginBottom: "20px",
//     transformStyle: "preserve-3d",
//     transition: "transform 0.8s cubic-bezier(.4,.2,.2,1)",
//   },

//   title: {
//     fontFamily: "Orbitron, Arial",
//     fontSize: "14px",
//     letterSpacing: "2px",
//     color: "var(--hud-primary)",
//     marginBottom: "16px",
//   },

//   row: {
//     display: "flex",
//     justifyContent: "space-between",
//     padding: "16px",
//     marginBottom: "14px",
//     borderRadius: "12px",
//     border: "1px solid",
//     background: "rgba(0, 30, 60, 0.6)",
//   },

//   text: {
//     fontSize: "15px",
//   },

//   subText: {
//     fontSize: "13px",
//     opacity: 0.85,
//   },

//   summaryRow: {
//     display: "flex",
//     justifyContent: "space-between",
//     fontSize: "14px",
//     lineHeight: "1.9",
//     color: "var(--hud-secondary)",
//   },

//   totalProfit: {
//     marginTop: "12px",
//     fontSize: "18px",
//     letterSpacing: "1px",
//     fontFamily: "Orbitron, Arial",
//     textAlign: "right",
//   },

//   detailBox: {
//     textAlign: "center",
//     lineHeight: "2",
//     fontSize: "14px",
//   },

//   flipHint: {
//     marginTop: "14px",
//     fontSize: "11px",
//     opacity: 0.6,
//     letterSpacing: "2px",
//   },
// };
import { useState } from "react";
import { GOLD_AP_MULTIPLIER, SILVER_AP_MULTIPLIER } from "../utils/apConstants";

export default function BuyHistory({ title, unit, data, prices }) {
  const [flipped, setFlipped] = useState(false);

  /* ===============================
     AP STATE PRICE (from shared constants)
     =============================== */
  const apPrice =
    title === "GOLD"
      ? prices.gold?.price * GOLD_AP_MULTIPLIER
      : prices.silver?.price * SILVER_AP_MULTIPLIER;

  /* ===============================
     AP CALCULATIONS
     =============================== */
  const apBuyDetails = data.buyDetails.map((buy) => {
    const profit = (apPrice - buy.buyPrice) * buy.qty;
    return { ...buy, profit };
  });

  const apTotalValue = apPrice * data.totalQty;
  const apTotalProfit = apTotalValue - data.totalCost;

  return (
    <div style={styles.scene} onClick={() => setFlipped(!flipped)}>
      <div
        style={{
          ...styles.card,
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* ================= FRONT (SPOT) ================= */}
        <div style={styles.face} className="glass">
          <h2 className="neon" style={styles.title}>
            {title} PORTFOLIO
          </h2>

          {data.buyDetails.map((buy, index) => {
            const isProfit = buy.profit >= 0;

            return (
              <div
                key={index}
                className="glass"
                style={{
                  ...styles.row,
                  borderColor: isProfit ? "#00ffe1" : "#ff4d4d",
                }}
              >
                <div>
                  <div>
                    Qty: {buy.qty} {unit}
                  </div>
                  <div style={styles.sub}>Buy @ ₹ {buy.buyPrice}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={styles.sub}>PROFIT</div>
                  <strong style={{ color: "#00ffe1" }}>
                    ₹ {Math.abs(buy.profit).toFixed(0)}
                  </strong>
                </div>
              </div>
            );
          })}

          <div style={styles.summary}>
            <div>
              Total Qty: {data.totalQty} {unit}
            </div>
            <div>Avg Buy: ₹ {data.avgBuy.toFixed(2)}</div>
            <div>Total Cost: ₹ {data.totalCost.toFixed(0)}</div>
            <div>Current Value: ₹ {data.totalValue.toFixed(0)}</div>
            <strong style={styles.total}>
              TOTAL PROFIT ₹ {Math.abs(data.totalProfit).toFixed(0)}
            </strong>
          </div>
        </div>

        {/* ================= BACK (AP STATE MARKET) ================= */}
        <div style={{ ...styles.face, ...styles.back }} className="glass">
          <h2 style={styles.title}>{title} PORTFOLIO (AP)</h2>

          {apBuyDetails.map((buy, index) => {
            const isApProfit = buy.profit >= 0;
            return (
              <div
                key={index}
                style={{
                  ...styles.row,
                  borderColor: isApProfit ? "#ffd36a" : "#ff4d4d",
                }}
              >
                <div>
                  <div>
                    Qty: {buy.qty} {unit}
                  </div>
                  <div style={styles.sub}>Buy @ ₹ {buy.buyPrice}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={styles.sub}>{isApProfit ? "PROFIT" : "LOSS"}</div>
                  <strong style={{ color: isApProfit ? "#ffd36a" : "#ff4d4d" }}>
                    ₹ {Math.abs(buy.profit).toFixed(0)}
                  </strong>
                </div>
              </div>
            );
          })}

          <div style={styles.summary}>
            <div>
              Total Qty: {data.totalQty} {unit}
            </div>
            <div>Avg Buy: ₹ {data.avgBuy.toFixed(2)}</div>
            <div>Total Cost: ₹ {data.totalCost.toFixed(0)}</div>
            <div>Current Value: ₹ {apTotalValue.toFixed(0)}</div>
            <strong style={{ ...styles.total, color: apTotalProfit >= 0 ? "#ffd36a" : "#ff4d4d" }}>
              TOTAL {apTotalProfit >= 0 ? "PROFIT" : "LOSS"} ₹ {Math.abs(apTotalProfit).toFixed(0)}
            </strong>
            <div style={styles.tap}>TAP TO RETURN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================
   STYLES
   =============================== */

const styles = {
  scene: { perspective: "1200px", cursor: "pointer" },
  card: {
    position: "relative",
    width: "100%",
    minHeight: "460px",
    borderRadius: "16px",
    transformStyle: "preserve-3d",
    transition: "transform 0.8s cubic-bezier(.4,.2,.2,1)",
  },

  face: {
    position: "absolute",
    inset: 0,
    padding: "20px",
    backfaceVisibility: "hidden",
    borderRadius: "16px",
  },

  back: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    transform: "rotateY(180deg)",
    backfaceVisibility: "hidden",
  },

  title: {
    fontSize: "14px",
    letterSpacing: "2px",
    marginBottom: "16px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  sub: { fontSize: "12px", opacity: 0.75 },
  summary: {
    marginTop: "16px",
    lineHeight: "1.8",
    fontSize: "14px",
  },
  total: {
    marginTop: "10px",
    display: "block",
    fontSize: "18px",
  },
  tap: {
    marginTop: "12px",
    fontSize: "11px",
    opacity: 0.6,
  },
};
