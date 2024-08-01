import React, { useEffect, useState } from "react";
import "./crypto_prices.css";
import { useDispatch, useSelector } from "react-redux";
import { coinActions } from "../../../store/reducers/coinReducer";
import toast from "react-hot-toast";

const CryptoPrices = () => {
  const [prices, setPrices] = useState({});
  const [lastPrices, setLastPrices] = useState({});

  const dispatch = useDispatch();
  const { favCoins } = useSelector((state) => state.coin);

  useEffect(() => {
    const coins = [
      { symbol: "btcusdt", name: "Bitcoin" },
      { symbol: "ethusdt", name: "Ethereum" },
      { symbol: "bnbusdt", name: "Binance Coin" },
      { symbol: "xrpusdt", name: "Ripple" },
      { symbol: "usdcusdt", name: "USD Coin" },
      { symbol: "adausdt", name: "Cardano" },
      { symbol: "dogeusdt", name: "Dogecoin" },
      { symbol: "maticusdt", name: "Polygon" },
      { symbol: "solusdt", name: "Solana" },
      { symbol: "dotusdt", name: "Polkadot" },
    ];

    const wsConnections = coins.map((coin) => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${coin.symbol}@trade`
      );

      ws.onmessage = (event) => {
        const stockObject = JSON.parse(event.data);
        const price = parseFloat(stockObject.p).toFixed(2);

        setPrices((prevPrices) => {
          // Store the last price before updating the current price
          setLastPrices((prevLastPrices) => ({
            ...prevLastPrices,
            [coin.symbol]: prevPrices[coin.symbol]?.price,
          }));

          return {
            ...prevPrices,
            [coin.symbol]: { price, name: coin.name },
          };
        });
      };

      return ws;
    });

    return () => {
      wsConnections.forEach((ws) => ws.close());
    };
  }, []);

  const handleAddToFavorites = (coin) => {
    let arr = [...favCoins, coin];
    dispatch(coinActions.setFavCoins(arr));
    localStorage.setItem("favCoins", JSON.stringify(arr));
    toast.success(`${coin.name} has been added to favorites.`);
  };

  return (
    <div className="w-full h-fit bg-white/80 text-black rounded-2xl font-normal md:font-semibold text-base md:text-lg p-6 coins-list grid gap-4 shadow-md">
      <div className=" text-base md:text-xl font-normal md:font-semibold px-[12px] py-[6px] bg-secondary rounded-md grid grid-cols-3">
        <h1>Name</h1>
        <h1>Price</h1>
        <h1>Action</h1>
      </div>
      {Object.keys(prices).map((symbol) => {
        const coin = prices[symbol];
        const lastPrice = lastPrices[symbol];

        return (
          <div key={symbol} className="list grid-cols-3">
            <h1 className="heading">{coin.name}:</h1>
            <p
              className="price"
              style={{
                color:
                  coin.price === lastPrice
                    ? "black"
                    : coin.price > lastPrice
                    ? "green"
                    : "red",
              }}
            >
              ${coin.price}
            </p>
            <div>
              <button
                onClick={() => {
                  handleAddToFavorites({ symbol, name: coin.name });
                }}
                className=" text-blue-500 text-sm md:text-base"
              >
                Add to ❤
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CryptoPrices;



/*
import React, { useEffect, useState } from "react";
import "./crypto_prices.css";
import { useDispatch, useSelector } from "react-redux";
import { coinActions } from "../../../store/reducers/coinReducer";
import toast from "react-hot-toast";

const CryptoPrices = () => {
  const [prices, setPrices] = useState({});
  const [lastPrices, setLastPrices] = useState({});

  const dispatch = useDispatch();
  const { favCoins } = useSelector((state) => state.coin);
  // const [currentFavCoins,  setCurrentFavCoins] = useState(favCoins || [])

  useEffect(() => {
    const coins = [
      { symbol: "btcusdt", name: "Bitcoin" },
      { symbol: "ethusdt", name: "Ethereum" },
      { symbol: "bnbusdt", name: "Binance Coin" },
      { symbol: "xrpusdt", name: "Ripple" },
      { symbol: "usdcusdt", name: "USD Coin" },
      { symbol: "adausdt", name: "Cardano" },
      { symbol: "dogeusdt", name: "Dogecoin" },
      { symbol: "maticusdt", name: "Polygon" },
      { symbol: "solusdt", name: "Solana" },
      { symbol: "dotusdt", name: "Polkadot" },
    ];

    const wsConnections = coins.map((coin) => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${coin.symbol}@trade`
      );

      ws.onmessage = (event) => {
        const stockObject = JSON.parse(event.data);
        const price = parseFloat(stockObject.p).toFixed(2);

        setPrices((prevPrices) => ({
          ...prevPrices,
          [coin.symbol]: { price, name: coin.name },
        }));
      };

      return ws;
    });

    return () => {
      wsConnections.forEach((ws) => ws.close());
    };
  }, []);

  const handleAddToFavirotes = (coin) => {
    let arr = [...favCoins, coin];
    dispatch(coinActions.setFavCoins(arr));
    localStorage.setItem("favCoins", JSON.stringify(arr));
    toast.success(`${coin.name} has been added to favorites.`);
  };
  return (
    <div className="w-full h-fit bg-white/80 text-black rounded-2xl font-normal md:font-semibold text-base md:text-lg p-6 coins-list grid gap-4 shadow-md">
      <div className=" text-base md:text-xl  font-normal md:font-semibold px-[12px] py-[6px] bg-secondary rounded-md grid grid-cols-3">
        <h1>Name</h1>
        <h1>Price</h1>
        <h1>Action</h1>
      </div>
      {Object.keys(prices).map((symbol, index) => {
        
        const coin = prices[symbol];
        const lastPrice = lastPrices[symbol];

        console.log(lastPrice + " --- " + coin.price);

        return (
          <div key={symbol} className="list grid-cols-3">
            <h1 className="heading">{coin.name}:</h1>
            <p
              className="price"
              style={{
                color:
                  coin.price === lastPrice
                    ? "black"
                    : coin.price > lastPrice
                    ? "green"
                    : "red",
              }}
            >
              ${coin.price}
            </p>
            <div>
              <button
                onClick={() => {
                  handleAddToFavirotes({ symbol, name: coin.name });
                }}
                className=" text-blue-500 text-sm md:text-base"
              >
                Add to ❤
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CryptoPrices;

*/
