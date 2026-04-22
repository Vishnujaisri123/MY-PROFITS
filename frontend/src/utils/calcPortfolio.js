// frontend/src/utils/calcPortfolio.js
// Replicates backend profitEngine.js — computes portfolio P/L on the frontend
// so we can recalculate instantly when the user edits holdings.

export function calcPortfolio(buys, livePrice) {
  let totalQty  = 0;
  let totalCost = 0;

  const buyDetails = buys.map((buy) => {
    const cost         = buy.qty * buy.buyPrice;
    const currentValue = buy.qty * livePrice;
    const profit       = currentValue - cost;

    totalQty  += buy.qty;
    totalCost += cost;

    return {
      id:           buy.id,
      qty:          buy.qty,
      buyPrice:     buy.buyPrice,
      cost,
      currentValue,
      profit,
    };
  });

  const totalValue  = totalQty * livePrice;
  const totalProfit = totalValue - totalCost;
  const avgBuy      = totalQty > 0 ? totalCost / totalQty : 0;

  return { buyDetails, totalQty, totalCost, totalValue, totalProfit, avgBuy };
}
