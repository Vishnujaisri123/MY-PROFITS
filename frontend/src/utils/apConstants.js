// frontend/src/utils/apConstants.js
//
// SINGLE SOURCE OF TRUTH for AP State market multipliers.
// These ratios convert Indian domestic price → Andhra Pradesh (CapsGold) local price.
//
// How to calibrate:
//   1. Note the current Indian domestic price shown in LIVE METAL FEED
//   2. Note the current CapsGold AP rate for the same metal at the same time
//   3. Multiplier = CapsGold_AP_rate / Indian_domestic_price
//
// Last calibrated (2026-04-24):
//   GOLD:   Already correct — no change needed
//   SILVER: CapsGold AP = ₹252,000/kg  ÷  Indian domestic ≈ ₹226,874/kg  = 1.1107

export const GOLD_AP_MULTIPLIER   = 15293.4 / 13827.59;  // ≈ 1.106 (₹/gram) — correct ✅
export const SILVER_AP_MULTIPLIER = 252000  / 226874;     // ≈ 1.1107 (₹/kg)  — calibrated to CapsGold ✅
