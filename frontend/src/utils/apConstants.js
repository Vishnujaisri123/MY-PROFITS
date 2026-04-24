// frontend/src/utils/apConstants.js
//
// AP STATE MARKET multipliers — applied ON TOP of Indian domestic base price.
//
// ── IMPORTANT: After the backend price fix (July 2024) ──────────────────────
// The backend priceService.js now applies the full Indian duty stack:
//   6% Basic Customs Duty + 3% GST + 1% dealer premium = ×1.1018 (gold)
//                                                        = ×1.1234 (silver)
//
// So the base price from the WebSocket IS ALREADY the Indian domestic price.
// These multipliers now only represent the tiny LOCAL AP market premium
// that AP dealers charge above the national Indian domestic rate.
//
// Typical AP local premium: ~0.4–0.5% above national Indian domestic price.
//
// How to update: Open CapsGold and note the AP rate and the LIVE METAL FEED
// rate shown on your own website at the same time. Then:
//   GOLD_AP_MULTIPLIER   = CapsGold_gold_rate   / your_live_gold_rate
//   SILVER_AP_MULTIPLIER = CapsGold_silver_rate  / your_live_silver_rate

export const GOLD_AP_MULTIPLIER   = 1.004;   // ~0.4% AP local premium over Indian domestic
export const SILVER_AP_MULTIPLIER = 1.005;   // ~0.5% AP local premium over Indian domestic
