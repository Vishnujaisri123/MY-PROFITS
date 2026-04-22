import { holdings } from "./holdings.js";
import { calculateDetailedPnL } from "./profitEngine.js";

export function computePortfolio(prices) {
  return {
    gold: calculateDetailedPnL(
      holdings.gold.buys,
      prices.gold.price  // ₹/10g → ₹/g
    ),
    silver: calculateDetailedPnL(
      holdings.silver.buys,
      prices.silver.price // ₹/kg
    )
  };
}
