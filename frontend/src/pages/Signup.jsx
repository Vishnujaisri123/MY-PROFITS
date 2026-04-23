import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }
    try {
      await signup(username, password);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    }
  };

  return (
    <div className="app-grid" style={styles.container}>
      <div className="glass" style={styles.card}>
        <h1 style={styles.title}>IDENTITY ENROLLMENT</h1>
        <p style={styles.subtitle}>CREATE NEW OPERATOR PROFILE</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PROPOSED ID</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input}
              placeholder="Username"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>SECURITY KEY</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>CONFIRM KEY</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" style={styles.button}>
            ESTABLISH LINK
          </button>
        </form>

        <div style={styles.footer}>
          Existing operator? <Link to="/login" style={styles.link}>Access Vault</Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    width: "100vw",
    background: "radial-gradient(circle at center, #001a33 0%, #000 100%)",
  },
  card: {
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    borderTop: "2px solid #ffd36a",
    boxShadow: "0 0 30px rgba(255, 211, 106, 0.2)",
  },
  title: {
    fontFamily: "Orbitron, sans-serif",
    fontSize: "24px",
    letterSpacing: "4px",
    color: "#ffd36a",
    margin: "0 0 10px 0",
  },
  subtitle: {
    fontSize: "12px",
    letterSpacing: "2px",
    opacity: 0.6,
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  inputGroup: {
    textAlign: "left",
  },
  label: {
    display: "block",
    fontSize: "10px",
    letterSpacing: "2px",
    marginBottom: "8px",
    opacity: 0.8,
  },
  input: {
    width: "100%",
    padding: "12px",
    background: "rgba(255, 211, 106, 0.05)",
    border: "1px solid rgba(255, 211, 106, 0.3)",
    borderRadius: "4px",
    color: "#fff",
    fontFamily: "Orbitron, sans-serif",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    marginTop: "10px",
    padding: "15px",
    background: "transparent",
    border: "2px solid #ffd36a",
    color: "#ffd36a",
    fontFamily: "Orbitron, sans-serif",
    fontSize: "14px",
    letterSpacing: "2px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
  error: {
    color: "#ff4d4d",
    fontSize: "12px",
    marginTop: "-10px",
  },
  footer: {
    marginTop: "20px",
    fontSize: "12px",
    opacity: 0.7,
  },
  link: {
    color: "#ffd36a",
    textDecoration: "none",
    fontWeight: "bold",
  }
};
