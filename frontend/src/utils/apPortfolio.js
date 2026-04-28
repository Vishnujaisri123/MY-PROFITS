// frontend/src/utils/apPortfolio.js
//
// Calculates portfolio P&L at AP (CapsGold) market prices.
// apPrices = { gold: ₹/g, silver: ₹/kg } — same values shown in AP STATE MARKET panel.
// P&L = (AP current price × qty) - (original buy price × qty)

export function calculateAPPortfolio(portfolio, apPrices) {
  const build = (assetKey) => {
    const asset   = portfolio[assetKey];
    const apPrice = apPrices[assetKey] || 0;

    // Guard: if no holdings, return zero state
    if (!asset?.buyDetails?.length) {
      return { buyDetails: [], totalQty: 0, totalCost: 0, totalValue: 0, totalProfit: 0, avgBuy: 0 };
    }

    let totalQty  = 0;
    let totalCost = 0;

    const buyDetails = asset.buyDetails.map((buy) => {
      const qty          = buy.qty          || 0;
      const buyPrice     = buy.buyPrice     || 0;
      const buyCost      = buyPrice * qty;
      const currentValue = apPrice  * qty;
      const profit       = currentValue - buyCost;

      totalQty  += qty;
      totalCost += buyCost;

      return { ...buy, apProfit: profit };
    });

    const totalValue  = apPrice * totalQty;
    const totalProfit = totalValue - totalCost;
    const avgBuy      = totalQty > 0 ? totalCost / totalQty : 0;

    return { buyDetails, totalQty, totalCost, totalValue, totalProfit, avgBuy };
  };

  return {
    gold:   build("gold"),
    silver: build("silver"),
  };
}
