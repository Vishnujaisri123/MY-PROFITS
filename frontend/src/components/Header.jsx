// frontend/src/components/Header.jsx

export default function Header() {
  return (
    <div style={styles.header}>
      <h2>MY-PROFITS 👑</h2>
      <p>Live Gold & Silver Profit Tracker</p>
    </div>
  );
}

const styles = {
  header: {
    textAlign: "center",
    padding: "15px",
    borderBottom: "1px solid #333",
    color: "#fff"
  }
};
