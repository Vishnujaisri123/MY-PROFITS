// frontend/src/utils/apConstants.js
//
// SINGLE SOURCE OF TRUTH for AP State market multipliers.
// These ratios convert global spot price → Andhra Pradesh local market price.
//
// How to update: Replace the numerator/denominator with the latest known
// [AP local price] / [Global spot price at that same moment].
//
//   GOLD   example: AP rate ₹9,333/g ÷ Global ₹7,886/g ≈ 1.1835
//   SILVER example: AP rate ₹105.67/g ÷ Global ₹89.30/g ≈ 1.1834

export const GOLD_AP_MULTIPLIER   = 15293.4 / 13827.59;  // ≈ 1.106 (₹/gram)
export const SILVER_AP_MULTIPLIER = 252345  / 238598.55; // ≈ 1.058 (₹/kg)
