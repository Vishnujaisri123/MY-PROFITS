// backend/src/priceService.js
// Primary:  metals.live  (free, no API key, works from cloud servers)
// Fallback: fawazahmed0 currency API via jsDelivr CDN (also free, no key)
// USD→INR:  open.er-api.com (already working on Render ✅)

import axios from "axios";

// ─── API endpoints ─────────────────────────────────────────────────────────
const METALS_URL   = "https://metals.live/api/v1/spot";
const BACKUP_GOLD  = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json";
const FX_URL       = "https://open.er-api.com/v6/latest/USD";

// ─── Cache ─────────────────────────────────────────────────────────────────
let cachedPrices  = { gold: null, silver: null, lastUpdated: 0 };
let usdInr        = null;
let fxLastUpdated = 0;

// ─── USD → INR  (refresh every 60 min) ─────────────────────────────────────
async function getUsdInr() {
  if (usdInr && Date.now() - fxLastUpdated < 60 * 60 * 1000) return usdInr;
  const res  = await axios.get(FX_URL, { timeout: 8000 });
  usdInr        = res.data.rates.INR;
  fxLastUpdated = Date.now();
  console.log(`💱 USD/INR: ${usdInr.toFixed(2)}`);
  return usdInr;
}

// ─── Primary: metals.live ──────────────────────────────────────────────────
// Returns: [{ gold: 3300.5, silver: 32.5, ... }]  (USD per troy oz)
async function fetchFromMetalsLive(inr) {
  const res     = await axios.get(METALS_URL, {
    headers: { "User-Agent": "Mozilla/5.0" },
    timeout: 10000,
  });

  const data        = Array.isArray(res.data) ? res.data[0] : res.data;
  const goldUsdOz   = data.gold;
  const silverUsdOz = data.silver;

  if (!goldUsdOz || !silverUsdOz) throw new Error("metals.live: missing gold/silver data");

  cachedPrices.gold        = Number(((goldUsdOz   * inr) / 31.1035).toFixed(2));
  cachedPrices.silver      = Number(((silverUsdOz * inr) / 31.1035 * 1000).toFixed(2));
  cachedPrices.lastUpdated = Date.now();

  console.log(`✅ metals.live — Gold ₹${cachedPrices.gold}/g | Silver ₹${cachedPrices.silver}/kg`);
}

// ─── Fallback: fawazahmed0 currency API (jsDelivr CDN) ────────────────────
// XAU = troy oz of gold in USD → invert to get USD price per oz
async function fetchFromCurrencyApi(inr) {
  const res          = await axios.get(BACKUP_GOLD, { timeout: 10000 });
  const rates        = res.data.usd;

  // rates.xau = how many troy oz you get per 1 USD → invert for USD/oz
  const goldUsdOz    = 1 / rates.xau;
  const silverUsdOz  = 1 / rates.xag;

  if (!goldUsdOz || !silverUsdOz) throw new Error("Currency API: missing xau/xag");

  cachedPrices.gold        = Number(((goldUsdOz   * inr) / 31.1035).toFixed(2));
  cachedPrices.silver      = Number(((silverUsdOz * inr) / 31.1035 * 1000).toFixed(2));
  cachedPrices.lastUpdated = Date.now();

  console.log(`✅ [fallback] currency API — Gold ₹${cachedPrices.gold}/g | Silver ₹${cachedPrices.silver}/kg`);
}

// ─── Fetch with automatic fallback ─────────────────────────────────────────
async function fetchPrices() {
  const inr = await getUsdInr();

  try {
    await fetchFromMetalsLive(inr);
  } catch (primaryErr) {
    console.warn(`⚠️  metals.live failed (${primaryErr.message}) — trying fallback...`);
    await fetchFromCurrencyApi(inr);  // throws if this also fails
  }
}

// ─── PUBLIC: called every second by websocket.js ───────────────────────────
export async function fetchLivePrices() {
  try {
    // Refresh from API every 15 minutes
    if (!cachedPrices.gold || Date.now() - cachedPrices.lastUpdated > 15 * 60 * 1000) {
      await fetchPrices();
    }

    return {
      gold:      tick("gold",   cachedPrices.gold),
      silver:    tick("silver", cachedPrices.silver),
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error("❌ All price sources failed:", err.message);

    // Return last cached prices so app stays alive
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

// ─── Tick simulation (1-second visual movement on cached base) ──────────────
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
