export default function LiveRates({ prices }) {
  return (
    <div className="glass" style={styles.card}>
      <h2 style={styles.title}>LIVE METAL FEED</h2>
      <div style={styles.subtitle}>🌍 International Spot Rate</div>

      <RateRow
        label="GOLD (₹ / gram)"
        price={prices.gold?.spot}
        direction={prices.gold?.direction}
      />

      <RateRow
        label="SILVER (₹ / kg)"
        price={prices.silver?.spot}
        direction={prices.silver?.direction}
      />
    </div>
  );
}

function RateRow({ label, price, direction }) {
  const priceColor =
    direction === "up"
      ? "var(--neon)"
      : direction === "down"
        ? "var(--danger)"
        : "var(--text-main)";

  return (
    <div style={styles.row}>
      <span style={styles.label}>{label}</span>
      <strong style={{ ...styles.price, color: priceColor }}>
        ₹ {price}
      </strong>
    </div>
  );
}

const styles = {
  card: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    height: "100%",
  },
  title: {
    color: "var(--text-main)",
    letterSpacing: "3px",
    marginBottom: "4px",
    fontSize: "14px",
    fontFamily: "Orbitron, sans-serif",
    textTransform: "uppercase",
  },
  subtitle: {
    fontSize: "10px",
    letterSpacing: "2px",
    opacity: 0.5,
    fontFamily: "Inter, sans-serif",
    marginBottom: "14px",
    color: "var(--neon)",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    borderRadius: "12px",
    background: "rgba(0, 0, 0, 0.4)",
    border: "1px solid rgba(0, 255, 225, 0.15)",
    transition: "all 0.3s ease",
  },
  price: {
    fontFamily: "Orbitron, sans-serif",
    fontSize: "20px",
    letterSpacing: "1px",
    fontWeight: "bold",
  },
  label: {
    fontFamily: "Inter, sans-serif",
    fontSize: "11px",
    letterSpacing: "2px",
    color: "var(--text-muted)",
  },
};
