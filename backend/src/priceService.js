// backend/src/priceService.js
// Uses Yahoo Finance (free, no API key, no quota) + open.er-api.com for USD→INR

import axios from "axios";

const YAHOO_URL  = "https://query1.finance.yahoo.com/v7/finance/quote";
const FX_URL     = "https://open.er-api.com/v6/latest/USD";

// ─── Cache ────────────────────────────────────────────────────────────────────
let cachedPrices = { gold: null, silver: null, lastUpdated: 0 };
let usdInr       = null;
let fxLastUpdated = 0;

// ─── USD → INR  (refresh every 60 min, free, no key) ─────────────────────────
async function getUsdInr() {
  if (usdInr && Date.now() - fxLastUpdated < 60 * 60 * 1000) return usdInr;

  const res = await axios.get(FX_URL, { timeout: 8000 });
  usdInr       = res.data.rates.INR;
  fxLastUpdated = Date.now();
  console.log(`💱 USD/INR rate: ${usdInr.toFixed(2)}`);
  return usdInr;
}

// ─── Yahoo Finance: GC=F (gold) + SI=F (silver) in USD/oz ────────────────────
async function fetchFromYahoo() {
  const inr = await getUsdInr();

  const res = await axios.get(YAHOO_URL, {
    params:  { symbols: "GC=F,SI=F" },
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Accept":     "application/json",
    },
    timeout: 10000,
  });

  const results = res.data.quoteResponse?.result;
  if (!results || results.length < 2) throw new Error("Yahoo Finance: empty result");

  const goldData   = results.find((r) => r.symbol === "GC=F");
  const silverData = results.find((r) => r.symbol === "SI=F");

  if (!goldData || !silverData) throw new Error("Yahoo Finance: missing symbol");

  const goldUsdOz   = goldData.regularMarketPrice;
  const silverUsdOz = silverData.regularMarketPrice;

  // Convert to Indian units
  // Gold:   USD/troy-oz → ₹/gram       (÷ 31.1035 × INR)
  // Silver: USD/troy-oz → ₹/kg         (÷ 31.1035 × INR × 1000 ÷ 1000 = × INR / 31.1035 × 1000)
  cachedPrices.gold        = Number(((goldUsdOz   * inr) / 31.1035).toFixed(2));
  cachedPrices.silver      = Number(((silverUsdOz * inr) / 31.1035 * 1000).toFixed(2));
  cachedPrices.lastUpdated = Date.now();

  console.log(`✅ Yahoo Finance refreshed — Gold ₹${cachedPrices.gold}/g | Silver ₹${cachedPrices.silver}/kg`);
}

// ─── PUBLIC: called every second by websocket.js ──────────────────────────────
export async function fetchLivePrices() {
  try {
    // Refresh from Yahoo every 15 minutes
    if (!cachedPrices.gold || Date.now() - cachedPrices.lastUpdated > 15 * 60 * 1000) {
      await fetchFromYahoo();
    }

    return {
      gold:      tick("gold",   cachedPrices.gold),
      silver:    tick("silver", cachedPrices.silver),
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error("⚠️  Price fetch failed:", err.message);

    // Return last cached prices (smooth fallback — keeps app alive)
    if (cachedPrices.gold) {
      return {
        gold:      tick("gold",   cachedPrices.gold),
        silver:    tick("silver", cachedPrices.silver),
        timestamp: Date.now(),
      };
    }

    return null;
  }
}

// ─── Tick simulation (1-second visual movement) ───────────────────────────────
let lastTick = { gold: null, silver: null };

function tick(type, basePrice) {
  const variation = (Math.random() - 0.5) * (type === "gold" ? 20 : 50);
  const price     = Number((basePrice + variation).toFixed(2));

  let direction = "same";
  if (lastTick[type] !== null) {
    if (price > lastTick[type]) direction = "up";
    if (price < lastTick[type]) direction = "down";
  }

  lastTick[type] = price;
  return { price, direction };
}
