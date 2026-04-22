import { useEffect, useState } from "react";
import { connectSocket } from "./services/socket";

import LiveRates from "./components/LiveRates";
import BuyHistory from "./components/BuyHistory";
import ArcReactor from "./components/ArcReactor";
import StateMarketFeed from "./components/StateMarketFeed";

import { calcPortfolio } from "./utils/calcPortfolio";
import { calculateAPPortfolio } from "./utils/apPortfolio";
import { GOLD_AP_MULTIPLIER, SILVER_AP_MULTIPLIER } from "./utils/apConstants";
import { usePortfolioEditor } from "./hooks/usePortfolioEditor";

export default function App() {
  const [prices,     setPrices]     = useState({});
  const [systemMode, setSystemMode] = useState(false);

  // Custom editable holdings (stored in localStorage)
  const { holdings, updateBuy, addBuy, deleteBuy } = usePortfolioEditor();

  useEffect(() => {
    connectSocket((msg) => {
      // Only pull live prices from backend — portfolio is computed locally
      if (msg.prices) setPrices(msg.prices);
    });
  }, []);

  /* Loading */
  if (!prices.gold?.price || !prices.silver?.price) {
    return <div className="app-loading">INITIALIZING SYSTEM…</div>;
  }

  /* ── Compute SPOT portfolios locally from holdings + live prices ── */
  const goldPortfolio   = calcPortfolio(holdings.gold,   prices.gold.price);
  const silverPortfolio = calcPortfolio(holdings.silver, prices.silver.price);

  /* ── AP market portfolios ─────────────────────────────────────── */
  const apPrices = {
    gold:   prices.gold.price   * GOLD_AP_MULTIPLIER,
    silver: prices.silver.price * SILVER_AP_MULTIPLIER,
  };
  const combined = {
    gold:   goldPortfolio,
    silver: silverPortfolio,
  };
  const apPortfolio = calculateAPPortfolio(combined, apPrices);

  return (
    <div className="theme-gold app-grid">

      {systemMode ? (
        <div className="app-system-mode" onClick={() => setSystemMode(false)}>
          <ArcReactor portfolio={combined} apPortfolio={apPortfolio} />
        </div>
      ) : (
        <>
          {/* LEFT — live rates */}
          <div className="app-left">
            <div className="glass">
              <LiveRates prices={prices} />
            </div>
            <StateMarketFeed prices={prices} />
          </div>

          {/* CENTER — arc reactor */}
          <div className="app-center">
            <ArcReactor
              portfolio={combined}
              apPortfolio={apPortfolio}
              onSystemMode={() => setSystemMode(true)}
            />
          </div>

          {/* RIGHT — editable portfolio cards */}
          <div className="app-right">
            <BuyHistory
              title="GOLD"
              unit="g"
              data={goldPortfolio}
              prices={prices}
              holdings={holdings.gold}
              onUpdate={(id, field, val) => updateBuy("gold",   id, field, val)}
              onAdd={()                  => addBuy("gold")}
              onDelete={(id)             => deleteBuy("gold",   id)}
            />
            <BuyHistory
              title="SILVER"
              unit="kg"
              data={silverPortfolio}
              prices={prices}
              holdings={holdings.silver}
              onUpdate={(id, field, val) => updateBuy("silver", id, field, val)}
              onAdd={()                  => addBuy("silver")}
              onDelete={(id)             => deleteBuy("silver", id)}
            />
          </div>
        </>
      )}
    </div>
  );
}
