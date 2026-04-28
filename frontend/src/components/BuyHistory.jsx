import { useState } from "react";
import { GOLD_AP_MULTIPLIER, SILVER_AP_MULTIPLIER } from "../utils/apConstants";

export default function BuyHistory({
  title, unit, data, prices,
  holdings, onUpdate, onAdd, onDelete,
}) {
  const [flipped,  setFlipped]  = useState(false);
  const [editMode, setEditMode] = useState(false);

  const isGold  = title === "GOLD";
  const accentColor = isGold ? "#ffd36a" : "#c0d8ff";

  /* ── AP price — uses spot (same as AP STATE MARKET panel & ArcReactor) ── */
  const spotPrice = isGold
    ? (prices.gold?.spot   || prices.gold?.price   / 1.1018)
    : (prices.silver?.spot || prices.silver?.price / 1.1234);
  const apPrice = spotPrice * (isGold ? GOLD_AP_MULTIPLIER : SILVER_AP_MULTIPLIER);

  /* ── AP calculations ─────────────────────────────────────────── */
  const apBuyDetails  = data.buyDetails.map((b) => ({
    ...b, profit: (apPrice - b.buyPrice) * b.qty,
  }));
  const apTotalValue  = apPrice * data.totalQty;
  const apTotalProfit = apTotalValue - data.totalCost;

  /* ── Stop flip when user taps edit button ────────────────────── */
  const handleEditToggle = (e) => {
    e.stopPropagation();
    setEditMode(!editMode);
    if (flipped) setFlipped(false);
  };

  return (
    <div style={styles.wrapper}>

      {/* ═══════════════ FLIP CARD ═══════════════ */}
      <div
        style={styles.scene}
        onClick={() => !editMode && setFlipped(!flipped)}
      >
        <div style={{
          ...styles.card,
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          minHeight: editMode ? "auto" : "460px",
        }}>

          {/* ── FRONT (SPOT MARKET) ─────────────────── */}
          <div style={styles.face} className="glass">
            {/* Header row */}
            <div style={styles.headerRow}>
              <h2 style={{ ...styles.title, color: accentColor }}>
                {title} PORTFOLIO
              </h2>
              <button
                style={{ ...styles.editBtn, borderColor: accentColor, color: accentColor }}
                onClick={handleEditToggle}
              >
                {editMode ? "✕ CLOSE" : "✏ EDIT"}
              </button>
            </div>

            {/* Buy rows */}
            {data.buyDetails.map((buy) => {
              const isProfit = buy.profit >= 0;
              return (
                <div
                  key={buy.id}
                  className="glass"
                  style={{
                    ...styles.row,
                    borderColor: isProfit ? "#00ffe1" : "#ff4d4d",
                  }}
                >
                  <div>
                    <div style={styles.rowMain}>
                      {buy.qty} <span style={styles.sub}>{unit}</span>
                    </div>
                    <div style={styles.sub}>Buy @ ₹{buy.buyPrice?.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.sub}>{isProfit ? "PROFIT" : "LOSS"}</div>
                    <strong style={{ color: isProfit ? "#00ffe1" : "#ff4d4d", fontSize: "15px" }}>
                      ₹{Math.abs(buy.profit).toFixed(0)}
                    </strong>
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            <div style={styles.summary}>
              <SummaryRow label="Total Qty"     value={`${data.totalQty} ${unit}`}    />
              <SummaryRow label="Avg Buy"        value={`₹${data.avgBuy.toFixed(0)}`}  />
              <SummaryRow label="Total Cost"     value={`₹${fmt(data.totalCost)}`}     />
              <SummaryRow label="Current Value"  value={`₹${fmt(data.totalValue)}`}    />
              <div style={{
                ...styles.totalProfit,
                color: data.totalProfit >= 0 ? "#00ffe1" : "#ff4d4d",
              }}>
                TOTAL {data.totalProfit >= 0 ? "PROFIT" : "LOSS"}&nbsp;
                ₹{fmt(Math.abs(data.totalProfit))}
              </div>
            </div>

            {!editMode && (
              <div style={styles.tapHint}>TAP TO VIEW AP MARKET</div>
            )}
          </div>

          {/* ── BACK (AP STATE MARKET) ──────────────── */}
          <div style={{ ...styles.face, ...styles.back }} className="glass">
            <h2 style={{ ...styles.title, color: accentColor }}>
              {title} PORTFOLIO (AP)
            </h2>

            {apBuyDetails.map((buy) => {
              const ok = buy.profit >= 0;
              return (
                <div key={buy.id} style={{
                  ...styles.row,
                  borderColor: ok ? accentColor : "#ff4d4d",
                }}>
                  <div>
                    <div style={styles.rowMain}>{buy.qty} <span style={styles.sub}>{unit}</span></div>
                    <div style={styles.sub}>Buy @ ₹{buy.buyPrice?.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={styles.sub}>{ok ? "PROFIT" : "LOSS"}</div>
                    <strong style={{ color: ok ? accentColor : "#ff4d4d", fontSize: "15px" }}>
                      ₹{Math.abs(buy.profit).toFixed(0)}
                    </strong>
                  </div>
                </div>
              );
            })}

            <div style={styles.summary}>
              <SummaryRow label="Total Qty"    value={`${data.totalQty} ${unit}`}       />
              <SummaryRow label="Avg Buy"       value={`₹${data.avgBuy.toFixed(0)}`}    />
              <SummaryRow label="Total Cost"    value={`₹${fmt(data.totalCost)}`}       />
              <SummaryRow label="Current Value" value={`₹${fmt(apTotalValue)}`}         color={accentColor} />
              <div style={{
                ...styles.totalProfit,
                color: apTotalProfit >= 0 ? accentColor : "#ff4d4d",
              }}>
                TOTAL {apTotalProfit >= 0 ? "PROFIT" : "LOSS"}&nbsp;
                ₹{fmt(Math.abs(apTotalProfit))}
              </div>
            </div>

            <div style={styles.tapHint}>TAP TO RETURN</div>
          </div>
        </div>
      </div>

      {/* ═══════════════ EDIT PANEL ═══════════════ */}
      {editMode && (
        <div className="glass" style={styles.editPanel}>
          <div style={styles.editHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button
                style={{ ...styles.backBtn, borderColor: accentColor, color: accentColor }}
                onClick={handleEditToggle}
              >
                ← BACK
              </button>
              <span style={{ color: accentColor, letterSpacing: "2px", fontSize: "12px" }}>
                ✏ EDIT {title} HOLDINGS
              </span>
            </div>
            <span style={styles.sub}>Changes saved automatically</span>
          </div>

          {/* Column labels */}
          <div style={styles.editLabelRow}>
            <span style={styles.editLabel}>QTY ({unit})</span>
            <span style={styles.editLabel}>BUY PRICE (₹/{unit})</span>
            <span style={{ width: "28px" }} />
          </div>

          {/* Editable buy rows */}
          {holdings.map((buy) => (
            <div key={buy.id} style={styles.editRow}>
              <input
                type="number"
                value={buy.qty}
                min="0"
                step="any"
                style={styles.input}
                onChange={(e) => onUpdate(buy.id, "qty", e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <input
                type="number"
                value={buy.buyPrice}
                min="0"
                step="1"
                style={styles.input}
                onChange={(e) => onUpdate(buy.id, "buyPrice", e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                style={styles.deleteBtn}
                onClick={(e) => { e.stopPropagation(); onDelete(buy.id); }}
                title="Remove this buy entry"
              >
                ×
              </button>
            </div>
          ))}

          {/* Add new buy */}
          <button
            style={{ ...styles.addBtn, borderColor: accentColor, color: accentColor }}
            onClick={(e) => { e.stopPropagation(); onAdd(); }}
          >
            + ADD BUY
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Helper components ──────────────────────────────────────────── */
function SummaryRow({ label, value, color }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", lineHeight: "1.9" }}>
      <span style={{ opacity: 0.7 }}>{label}</span>
      <span style={color ? { color } : {}}>{value}</span>
    </div>
  );
}

function fmt(n) {
  return Number(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/* ── Styles ─────────────────────────────────────────────────────── */
/* ── Styles ─────────────────────────────────────────────────────── */
const styles = {
  wrapper:  { display: "flex", flexDirection: "column", gap: "16px", flex: 1 },
  scene:    { perspective: "1200px", cursor: "pointer", height: "100%" },
  card: {
    position: "relative",
    width: "100%",
    minHeight: "460px",
    height: "100%",
    borderRadius: "16px",
    transformStyle: "preserve-3d",
    transition: "transform 0.8s cubic-bezier(.34, 1.56, .64, 1)",
  },
  face: {
    position: "absolute",
    inset: 0,
    padding: "24px",
    backfaceVisibility: "hidden",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
  },
  back: {
    transform: "rotateY(180deg)",
    overflowY: "auto",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },
  title: {
    fontSize: "14px",
    letterSpacing: "3px",
    margin: 0,
    fontFamily: "Orbitron, sans-serif",
    textTransform: "uppercase",
  },
  editBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid",
    borderRadius: "8px",
    padding: "6px 12px",
    fontSize: "11px",
    letterSpacing: "1px",
    cursor: "pointer",
    fontFamily: "Orbitron, sans-serif",
    transition: "all 0.3s ease",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "1px solid",
    background: "rgba(0, 0, 0, 0.4)",
    transition: "transform 0.3s ease",
  },
  rowMain: { fontSize: "16px", fontWeight: "600", marginBottom: "4px", fontFamily: "Inter, sans-serif" },
  sub:     { fontSize: "11px", opacity: 0.6, fontFamily: "Inter, sans-serif" },
  summary: { marginTop: "auto", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" },
  totalProfit: {
    marginTop: "12px",
    fontSize: "18px",
    fontFamily: "Orbitron, sans-serif",
    letterSpacing: "1.5px",
    fontWeight: "bold",
    textAlign: "right",
  },
  tapHint: { marginTop: "16px", fontSize: "10px", opacity: 0.4, letterSpacing: "3px", textAlign: "center", fontFamily: "Inter, sans-serif" },

  /* Edit panel */
  editPanel: {
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    background: "rgba(5, 12, 25, 0.85)",
    border: "1px solid rgba(0, 255, 225, 0.15)",
    boxShadow: "inset 0 0 20px rgba(0, 255, 225, 0.05)",
  },
  editHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  editLabelRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 34px",
    gap: "12px",
    marginBottom: "4px",
  },
  editLabel: { fontSize: "11px", opacity: 0.6, letterSpacing: "1px", fontFamily: "Inter, sans-serif" },
  editRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 34px",
    gap: "12px",
    alignItems: "center",
  },
  input: {
    background: "rgba(0, 0, 0, 0.5)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "8px",
    padding: "10px",
    color: "var(--hud-white)",
    fontSize: "14px",
    fontFamily: "Inter, sans-serif",
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.3s ease",
  },
  deleteBtn: {
    background: "rgba(255,77,77,0.1)",
    border: "1px solid rgba(255,77,77,0.4)",
    borderRadius: "8px",
    color: "var(--danger)",
    fontSize: "18px",
    lineHeight: 1,
    cursor: "pointer",
    width: "34px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.3s ease",
  },
  addBtn: {
    background: "transparent",
    border: "1px dashed",
    borderRadius: "8px",
    padding: "12px",
    fontSize: "13px",
    letterSpacing: "2px",
    fontFamily: "Orbitron, sans-serif",
    cursor: "pointer",
    textAlign: "center",
    transition: "background 0.3s ease",
    marginTop: "12px",
  },
  backBtn: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "11px",
    letterSpacing: "1px",
    cursor: "pointer",
    fontFamily: "Orbitron, sans-serif",
    transition: "background 0.3s ease",
  },
};
