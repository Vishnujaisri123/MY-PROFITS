// frontend/src/hooks/usePortfolioEditor.js
// Manages custom buy entries stored in localStorage.
// Falls back to the hardcoded defaults (matching backend/holdings.js) on first run.

import { useState, useEffect } from "react";

const STORAGE_KEY = "my_profits_holdings_v1";

// Default buy entries — mirrors backend/src/holdings.js
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
  const [holdings, setHoldings] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings));
  }, [holdings]);

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
