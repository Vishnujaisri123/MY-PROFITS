import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const STORAGE_KEY = "my_profits_holdings_v1";

const DEFAULTS = {
  gold: [
    { id: 1, qty: 7,  buyPrice: 10000  },
    { id: 2, qty: 10, buyPrice: 11300  },
    { id: 3, qty: 16, buyPrice: 12350  },
  ],
  silver: [
    { id: 1, qty: 4, buyPrice: 116000 },
    { id: 2, qty: 2, buyPrice: 118300 },
  ],
};

export function usePortfolioEditor() {
  const { token } = useAuth();
  const [holdings, setHoldings] = useState(DEFAULTS);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load holdings from API or localStorage
  useEffect(() => {
    const loadHoldings = async () => {
      if (token) {
        try {
          const res = await axios.get("/api/holdings");
          setHoldings(res.data);
        } catch (err) {
          console.error("Failed to fetch holdings from API", err);
          // Fallback to local if API fails
          const saved = localStorage.getItem(STORAGE_KEY);
          if (saved) setHoldings(JSON.parse(saved));
        }
      } else {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setHoldings(JSON.parse(saved));
      }
      setIsInitialLoad(false);
    };
    loadHoldings();
  }, [token]);

  // Persist to API and localStorage on every change
  useEffect(() => {
    if (isInitialLoad) return;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
    
    const syncToDB = async () => {
      if (token) {
        try {
          await axios.put("/api/holdings", { holdings });
        } catch (err) {
          console.error("Failed to sync holdings to DB", err);
        }
      }
    };

    // Debounce DB sync to avoid spamming the server
    const timeout = setTimeout(syncToDB, 1000);
    return () => clearTimeout(timeout);
  }, [holdings, token, isInitialLoad]);

  const updateBuy = (metal, id, field, value) => {
    setHoldings((h) => ({
      ...h,
      [metal]: h[metal].map((b) =>
        b.id === id ? { ...b, [field]: parseFloat(value) || 0 } : b
      ),
    }));
  };

  const addBuy = (metal) => {
    setHoldings((h) => ({
      ...h,
      [metal]: [...h[metal], { id: Date.now(), qty: 0, buyPrice: 0 }],
    }));
  };

  const deleteBuy = (metal, id) => {
    setHoldings((h) => ({
      ...h,
      [metal]: h[metal].filter((b) => b.id !== id),
    }));
  };

  const resetToDefault = (metal) => {
    setHoldings((h) => ({ ...h, [metal]: DEFAULTS[metal].map(b => ({ ...b })) }));
  };

  return { holdings, updateBuy, addBuy, deleteBuy, resetToDefault };
}
