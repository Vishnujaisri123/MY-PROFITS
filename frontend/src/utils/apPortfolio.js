export function calculateAPPortfolio(portfolio, apPrices) {
  const build = (assetKey) => {
    const asset = portfolio[assetKey];
    const apPrice = apPrices[assetKey];

    let totalQty = 0;
    let totalCost = 0;

    const buyDetails = asset.buyDetails.map((buy) => {
      const qty = buy.qty;
      const buyCost = buy.buyPrice * qty;
      const currentValue = apPrice * qty;
      const profit = currentValue - buyCost;

      totalQty += qty;
      totalCost += buyCost;

      return {
        ...buy,
        apProfit: profit,
      };
    });

    const totalValue = apPrice * totalQty;
    const totalProfit = totalValue - totalCost;
    const avgBuy = totalCost / totalQty;

    return {
      buyDetails,
      totalQty,
      totalCost,
      totalValue,
      totalProfit,
      avgBuy,
    };
  };

  return {
    gold: build("gold"),
    silver: build("silver"),
  };
}
