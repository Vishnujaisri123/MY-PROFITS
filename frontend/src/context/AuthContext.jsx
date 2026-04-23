import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// Set base URL for axios outside of component to avoid setting every render
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("username");
    return saved ? { username: saved } : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      delete axios.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post("/api/auth/login", { username, password });
    setToken(res.data.token);
    setUser({ username: res.data.username });
    localStorage.setItem("username", res.data.username);
    return res.data;
  };

  const signup = async (username, password) => {
    const res = await axios.post("/api/auth/register", { username, password });
    setToken(res.data.token);
    setUser({ username: res.data.username });
    localStorage.setItem("username", res.data.username);
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
