import { useEffect, useState } from "react";
import { connectSocket } from "./services/socket";

import LiveRates from "./components/LiveRates";
import BuyHistory from "./components/BuyHistory";
import ArcReactor from "./components/ArcReactor";
import StateMarketFeed from "./components/StateMarketFeed";
import { calculateAPPortfolio } from "./utils/apPortfolio";
import { GOLD_AP_MULTIPLIER, SILVER_AP_MULTIPLIER } from "./utils/apConstants";

export default function App() {
  const [data, setData] = useState({ prices: {}, portfolio: {} });
  const [systemMode, setSystemMode] = useState(false);

  useEffect(() => {
    connectSocket(setData);
  }, []);

  /* Loading */
  if (!data.portfolio?.gold || !data.portfolio?.silver || !data.prices?.gold?.price) {
    return <div className="app-loading">INITIALIZING SYSTEM…</div>;
  }

  /* AP portfolio */
  const apPrices = {
    gold:   data.prices.gold.price   * GOLD_AP_MULTIPLIER,
    silver: data.prices.silver.price * SILVER_AP_MULTIPLIER,
  };
  const apPortfolio = calculateAPPortfolio(data.portfolio, apPrices);

  return (
    <div className="theme-gold app-grid">

      {systemMode ? (
        /* ── FULLSCREEN SYSTEM MODE ── */
        <div className="app-system-mode" onClick={() => setSystemMode(false)}>
          <ArcReactor portfolio={data.portfolio} apPortfolio={apPortfolio} />
        </div>
      ) : (
        <>
          {/* LEFT — live rates */}
          <div className="app-left">
            <div className="glass">
              <LiveRates prices={data.prices} />
            </div>
            <StateMarketFeed prices={data.prices} />
          </div>

          {/* CENTER — arc reactor */}
          <div className="app-center">
            <ArcReactor
              portfolio={data.portfolio}
              apPortfolio={apPortfolio}
              onSystemMode={() => setSystemMode(true)}
            />
          </div>

          {/* RIGHT — portfolio cards */}
          <div className="app-right">
            <BuyHistory title="GOLD"   unit="g"  data={data.portfolio.gold}   prices={data.prices} />
            <BuyHistory title="SILVER" unit="kg" data={data.portfolio.silver} prices={data.prices} />
          </div>
        </>
      )}
    </div>
  );
}
