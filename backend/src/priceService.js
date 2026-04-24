// backend/src/priceService.js
//
// PRIMARY:  fawazahmed0 currency API (CDN-hosted, free, no key, works everywhere)
//           https://github.com/fawazahmed0/currency-api
//           Returns XAU (gold) and XAG (silver) rates vs USD
//
// FALLBACK: Cloudflare Pages mirror of same API
//
// USD→INR: open.er-api.com (confirmed working on Render ✅)
//
// TWO PRICES ARE BROADCAST:
//   spot  → International market price (USD × INR ÷ troy oz) — shown in LIVE METAL FEED
//   price → Indian domestic price (spot + duty + GST + premium) — used for P&L & AP market

import axios from "axios";

// ─── API endpoints ─────────────────────────────────────────────────────────
const CURRENCY_PRIMARY  = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.min.json";
const CURRENCY_FALLBACK = "https://latest.currency-api.pages.dev/v1/currencies/usd.min.json";
const FX_URL            = "https://open.er-api.com/v6/latest/USD";

// ─── Cache ─────────────────────────────────────────────────────────────────
let cachedPrices = {
  goldSpot: null, silverSpot: null,  // International spot (₹/g, ₹/kg)
  gold: null,     silver: null,       // Indian domestic    (₹/g, ₹/kg)
  lastUpdated: 0,
};
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

// ─── Indian Duty & Tax Multipliers ─────────────────────────────────────────
//
//  International spot is the raw global price with no Indian taxes.
//  Indian domestic (CapsGold / MCX physical) adds:
//    1. Basic Customs Duty (BCD):  6%  (reduced from 15% in July 2024 budget)
//    2. GST on gold/silver:        3%
//    3. Local dealer premium:     ~1%
//
//  Gold   multiplier = 1.06 × 1.03 × 1.01 ≈ 1.1018
//  Silver multiplier = 1.08 × 1.03 × 1.01 ≈ 1.1234  (silver BCD is 8%)
//
const GOLD_INDIA_MULTIPLIER   = 1.06 * 1.03 * 1.01;  // ≈ 1.1018
const SILVER_INDIA_MULTIPLIER = 1.08 * 1.03 * 1.01;  // ≈ 1.1234

// ─── Fetch from fawazahmed0 API ─────────────────────────────────────────────
async function fetchFromCurrencyApi(url, inr) {
  const res   = await axios.get(url, { timeout: 10000 });
  const rates = res.data?.usd;

  if (!rates?.xau || !rates?.xag) throw new Error("Missing xau/xag in response");

  const goldUsdOz   = 1 / rates.xau;
  const silverUsdOz = 1 / rates.xag;

  // International spot in INR (no duties) — shown in LIVE METAL FEED
  cachedPrices.goldSpot   = Number(((goldUsdOz   * inr) / 31.1035).toFixed(2));
  cachedPrices.silverSpot = Number(((silverUsdOz * inr) / 31.1035 * 1000).toFixed(2));

  // Indian domestic price — used for P&L and AP market calculations
  cachedPrices.gold   = Number((cachedPrices.goldSpot   * GOLD_INDIA_MULTIPLIER).toFixed(2));
  cachedPrices.silver = Number((cachedPrices.silverSpot * SILVER_INDIA_MULTIPLIER).toFixed(2));

  cachedPrices.lastUpdated = Date.now();

  console.log(`✅ Prices refreshed (USD/INR: ${inr.toFixed(2)}):`);
  console.log(`   GOLD   — Intl spot: $${goldUsdOz.toFixed(2)}/oz = ₹${cachedPrices.goldSpot}/g  |  Indian: ₹${cachedPrices.gold}/g`);
  console.log(`   SILVER — Intl spot: $${silverUsdOz.toFixed(2)}/oz = ₹${cachedPrices.silverSpot}/kg  |  Indian: ₹${cachedPrices.silver}/kg`);
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
    if (!cachedPrices.gold || Date.now() - cachedPrices.lastUpdated > 15 * 60 * 1000) {
      await fetchPrices();
    }
    return {
      gold:      tick("gold",   cachedPrices.goldSpot,   cachedPrices.gold),
      silver:    tick("silver", cachedPrices.silverSpot, cachedPrices.silver),
      timestamp: Date.now(),
    };
  } catch (err) {
    console.error("❌ All price sources failed:", err.message);
    if (cachedPrices.gold) {
      return {
        gold:      tick("gold",   cachedPrices.goldSpot,   cachedPrices.gold),
        silver:    tick("silver", cachedPrices.silverSpot, cachedPrices.silver),
        timestamp: Date.now(),
      };
    }
    return null;
  }
}

// ─── Tick simulation ────────────────────────────────────────────────────────
// Single % variation drives BOTH spot and Indian price so they always move in sync.
let lastTick = { gold: null, silver: null };

function tick(type, spotBase, indianBase) {
  const pctVariation = (Math.random() - 0.5) * 0.002;         // ±0.1% per second
  const spotPrice    = Number((spotBase   * (1 + pctVariation)).toFixed(2));
  const indianPrice  = Number((indianBase * (1 + pctVariation)).toFixed(2));

  let direction = "same";
  if (lastTick[type] !== null) {
    if (spotPrice > lastTick[type]) direction = "up";
    if (spotPrice < lastTick[type]) direction = "down";
  }
  lastTick[type] = spotPrice;

  return {
    spot:  spotPrice,   // ← International spot price in INR (no duties)
    price: indianPrice, // ← Indian domestic price (duty + GST + premium)
    direction,
  };
}
