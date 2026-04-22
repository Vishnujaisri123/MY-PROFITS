// backend/src/profitEngine.js

export function calculateDetailedPnL(buys, livePrice) {
  let totalQty = 0;
  let totalCost = 0;

  const buyDetails = buys.map((buy) => {
    const cost = buy.qty * buy.price;
    const currentValue = buy.qty * livePrice;
    const profit = currentValue - cost;

    totalQty += buy.qty;
    totalCost += cost;

    return {
      qty: buy.qty,
      buyPrice: buy.price,
      cost,
      currentValue,
      profit
    };
  });

  const avgBuy = totalCost / totalQty;
  const totalValue = totalQty * livePrice;
  const totalProfit = totalValue - totalCost;

  return {
    totalQty,
    avgBuy,
    totalCost,
    totalValue,
    totalProfit,
    buyDetails
  };
}
