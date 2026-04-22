export default function APMarketPortfolio({ title, unit, data }) {
  return (
    <div style={styles.card} className="glass">
      <h2 style={styles.title}>{title} PORTFOLIO (AP)</h2>

      {data.buyDetails.map((buy, index) => {
        const isProfit = buy.apProfit >= 0;

        return (
          <div
            key={index}
            style={{
              ...styles.row,
              borderColor: isProfit ? "var(--hud-profit)" : "var(--hud-loss)",
            }}
          >
            <div>
              <div>
                Qty: {buy.qty} {unit}
              </div>
              <div>Buy @ ₹ {buy.buyPrice}</div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div>{isProfit ? "PROFIT" : "LOSS"}</div>
              <strong
                style={{
                  color: isProfit ? "var(--hud-profit)" : "var(--hud-loss)",
                }}
              >
                ₹ {Math.abs(buy.apProfit).toFixed(0)}
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

        <strong
          style={{
            color:
              data.totalProfit >= 0 ? "var(--hud-profit)" : "var(--hud-loss)",
            fontSize: "18px",
          }}
        >
          TOTAL {data.totalProfit >= 0 ? "PROFIT" : "LOSS"} ₹{" "}
          {Math.abs(data.totalProfit).toFixed(0)}
        </strong>
      </div>
    </div>
  );
}

const styles = {
  card: {
    padding: "20px",
    borderRadius: "14px",
    border: "1px solid rgba(255,215,100,0.35)",
    marginBottom: "20px",
  },
  title: {
    color: "var(--hud-primary)",
    letterSpacing: "2px",
    marginBottom: "20px",
    fontFamily: "Orbitron, Arial",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid",
    background: "rgba(0, 30, 60, 0.6)",
  },
  summary: {
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px solid rgba(255,255,255,0.15)",
    lineHeight: "1.8",
  },
};
