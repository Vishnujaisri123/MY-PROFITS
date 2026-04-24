// frontend/src/utils/apConstants.js
//
// SINGLE SOURCE OF TRUTH for AP State market multipliers.
// These ratios convert INTERNATIONAL SPOT price → Andhra Pradesh (CapsGold) local price.
//
// AP market = spot × this multiplier
// (The spot price already comes from the backend via prices.gold.spot)
//
// How to calibrate:
//   1. Note the current spot price in LIVE METAL FEED
//   2. Note the current CapsGold AP rate at the same time
//   3. Multiplier = CapsGold_AP_rate / LIVE_METAL_FEED_spot_price
//
// Last calibrated (2026-04-24):
//   GOLD:   spot ≈ ₹14,224/g   → CapsGold AP target (user confirmed correct)
//   SILVER: spot ≈ ₹2,30,187/kg → CapsGold AP = ₹2,52,000/kg → 252000/230187 = 1.0947

export const GOLD_AP_MULTIPLIER   = 15293.4 / 13827.59;  // ≈ 1.106  (₹/gram) — user confirmed correct ✅
export const SILVER_AP_MULTIPLIER = 252000  / 230187;     // ≈ 1.0947 (₹/kg)  — calibrated: spot→CapsGold AP ✅
