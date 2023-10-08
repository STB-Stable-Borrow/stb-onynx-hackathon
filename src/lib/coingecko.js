const CoinGecko = require("coingecko-api");

const CoinGeckoClient = new CoinGecko();

//Todo: add coinbase and check for error, alert users if coinbase and coingecko fails
const getCurrentPrice = async (token) => {
  const data = await CoinGeckoClient.coins.fetch(token, {});
  if (data.success) {
    const price = data.data.market_data.current_price.usd;
    const format = price.toFixed(4);
    return [price, format];
  } else {
    console.error("getCurrentPrice failed");
    return;
  }
};

export { getCurrentPrice };
