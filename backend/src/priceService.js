// backend/src/priceService.js
//
// PRIMARY:  fawazahmed0 currency API (CDN-hosted, free, no key, works everywhere)
//           https://github.com/fawazahmed0/exchange-api
//           Returns XAU (gold) and XAG (silver) rates vs USD
//
// FALLBACK: Cloudflare Pages mirror of same API
//
// USD→INR: open.er-api.com (confirmed working on Render ✅)

import axios from "axios";

// ─── API endpoints ─────────────────────────────────────────────────────────
const CURRENCY_PRIMARY  = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json";
const CURRENCY_FALLBACK = "https://latest.currency-api.pages.dev/v1/currencies/usd.min.json";
const FX_URL            = "https://open.er-api.com/v6/latest/USD";

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

// ─── Fetch from fawazahmed0 API (returns XAU, XAG vs USD) ──────────────────
// xau = troy oz of gold per 1 USD  →  gold price = 1/xau  (USD per oz)
// xag = troy oz of silver per 1 USD → silver price = 1/xag (USD per oz)
async function fetchFromCurrencyApi(url, inr) {
  const res   = await axios.get(url, { timeout: 10000 });
  const rates = res.data?.usd;

  if (!rates?.xau || !rates?.xag) throw new Error("Missing xau/xag in response");

  const goldUsdOz   = 1 / rates.xau;
  const silverUsdOz = 1 / rates.xag;

  // Convert: USD/oz → INR/gram  |  USD/oz → INR/kg
  cachedPrices.gold        = Number(((goldUsdOz   * inr) / 31.1035).toFixed(2));
  cachedPrices.silver      = Number(((silverUsdOz * inr) / 31.1035 * 1000).toFixed(2));
  cachedPrices.lastUpdated = Date.now();

  console.log(`✅ Live prices — Gold ₹${cachedPrices.gold}/g | Silver ₹${cachedPrices.silver}/kg`);
  console.log(`   (Gold: $${goldUsdOz.toFixed(2)}/oz | Silver: $${silverUsdOz.toFixed(2)}/oz | USD/INR: ${inr.toFixed(2)})`);
}

// ─── Fetch with automatic fallback ─────────────────────────────────────────
async function fetchPrices() {
  const inr = await getUsdInr();

  try {
    await fetchFromCurrencyApi(CURRENCY_PRIMARY, inr);
  } catch (primaryErr) {
    console.warn(`⚠️  Primary API failed (${primaryErr.message}) — trying fallback...`);
    await fetchFromCurrencyApi(CURRENCY_FALLBACK, inr);
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

    // Return last known cached price so app stays alive
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

// ─── Tick simulation (1-second visual movement on cached base price) ────────
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
