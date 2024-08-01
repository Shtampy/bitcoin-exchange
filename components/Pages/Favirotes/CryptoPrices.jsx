// src/components/CryptoPrices.js
import React, { useEffect, useState } from "react";
import "./crypto_prices.css";
import { useDispatch, useSelector } from "react-redux";
import { coinActions } from "../../../store/reducers/coinReducer";
import toast from "react-hot-toast";

const CryptoPrices = () => {
  const dispatch = useDispatch();
  const { favCoins } = useSelector((state) => state.coin);
  const [removedCoins, setRemovedCoins] = useState([]);

  const [error, setError] = useState("");
  const [prices, setPrices] = useState({});
  const [lastPrices, setLastPrices] = useState({});

  useEffect(() => {
    const coins = favCoins;
    if (coins.length === 0) {
      setError("Nothing to show.");
      return;
    }
    setError("")
    // Clean up previous WebSocket connections
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

    // Clean up WebSocket connections on component unmount
    return () => {
      wsConnections.forEach((ws) => ws.close());
    };
  }, []);

  const handleRemoveToFavirotes = (coin) => {
    const arr = favCoins.filter((favCoin) => favCoin.symbol !== coin.symbol);
    dispatch(coinActions.setFavCoins(arr));
    localStorage.setItem("favCoins", JSON.stringify(arr));
    setPrices((prevPrices) => {
      const { [coin.symbol]: _, ...rest } = prevPrices;
      return rest;
    });
    setRemovedCoins((prev) => [...prev, coin.symbol]);
    toast.success(`${coin.name} has been removed from favorites.`);
  };

  return (
    <div className="w-full h-fit bg-white/80 text-black rounded-2xl  font-normal md:font-semibold text-base md:text-lg p-6 coins-list grid gap-4 shadow-md">
      <div className=" text-base md:text-xl  font-normal md:font-semibold px-[12px] py-[6px] bg-secondary rounded-md grid grid-cols-3">
        <h1>Name</h1>
        <h1>Price</h1>
        <h1>Action</h1>
      </div>
      {error?
        <p className=" text-red-500 text-center text-xl">{error}</p>
      :Object.keys(prices).map((symbol) => {
        const coin = prices[symbol];
        const lastPrice = lastPrices[symbol];

        if (removedCoins.includes(symbol)) {
          return;
        }

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
                  handleRemoveToFavirotes({ symbol, name: coin.name });
                }}
                className=" text-blue-500 text-sm md:text-lg"
              >
                Remove from ❤
              </button>
            </div>
          </div>
        );
      })
      }
    </div>
  );
};

export default CryptoPrices;
