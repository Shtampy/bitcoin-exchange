// src/components/CryptoPrices.js
import React, { useEffect, useState } from "react";
import "./crypto_prices.css";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const CryptoPrices = () => {
  const portfolio = JSON.parse(localStorage.getItem("portfolio")) || null;

  const balance = JSON.parse(localStorage.getItem("userBalance")) || 0;

  const [prices, setPrices] = useState({});
  const [showSellWindow, setShowSellWindow] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { favCoins } = useSelector((state) => state.coin);

  useEffect(() => {
    const coins = portfolio?.coins;
    if (portfolio === null) {
      setError("Nothing to show.");
      return;
    }

    setError("");
    const wsConnections = coins.map((coin) => {
      const ws = new WebSocket(
        `wss://stream.binance.com:9443/ws/${coin.symbol}@trade`
      );

      ws.onmessage = (event) => {
        const stockObject = JSON.parse(event.data);
        const price = parseFloat(stockObject.p).toFixed(2);

        setPrices((prevPrices) => ({
          ...prevPrices,
          [coin.symbol]: { currentPrice: price, ...coin },
        }));
      };

      return ws;
    });

    return () => {
      wsConnections.forEach((ws) => ws.close());
    };
  }, []);

  const handleSell = (coin) => {
    setShowSellWindow(coin);
  };

  const handleSellBtn = () => {
    const totalPrice = showSellWindow?.currentPrice * Number(quantity);

    const userCurrentBalance = Number(balance) + totalPrice;
    let portfolioBody;

    localStorage.setItem("userBalance", JSON.stringify(userCurrentBalance));
    if(showSellWindow?.amount === quantity){
      portfolioBody = {
        ...portfolio,
        coins: portfolio.coins.filter(
          (coin) => coin.symbol !== showSellWindow.symbol
        ),
      };
    }else{
      portfolioBody = {
        ...portfolio,
        coins: portfolio?.coins.map((item, index)=>{
          if(item.symbol === showSellWindow.symbol){
            return {
              ...item,
              amount: Number(item.amount) - Number(quantity),
            }
          }else{
            return item;
          }
        })
      };
    }
    

    localStorage.setItem("portfolio", JSON.stringify(portfolioBody));
    toast.success(
      "You successfully sold " +
        quantity +
        " " +
        showSellWindow?.name +
        " coins."
    );
    setQuantity(0);
    setShowSellWindow(null);
    window.location.reload();
  };
  return (
    <>
      {showSellWindow !== null ? (
        <div className="w-full md:w-[65%] h-fit bg-white/80 text-black rounded-2xl text-base md:text-lg  font-normal md:font-semibold p-6 coins-list grid gap-4 shadow-md relative">
          <X
            onClick={() => {
              setQuantity(0);
              setShowSellWindow(null);
            }}
            className=" cursor-pointer"
            size={32}
          />
          <div className=" p-2 md:p-4 grid gap-4">
            <div className=" grid grid-cols-2">
              <span>Coin Name:</span>
              <span className="text-primary">
                {showSellWindow?.name} ({showSellWindow?.symbol})
              </span>
            </div>
            <div className=" grid grid-cols-2">
              <span>Buying Price:</span>
              <span className="text-primary">
                ${showSellWindow?.buyingPrice}
              </span>
            </div>
            <div className=" grid grid-cols-2">
              <span>Amount:</span>
              <span className="text-primary">{showSellWindow?.amount}</span>
            </div>
            <div className=" grid grid-cols-2">
              <span>Current Price:</span>
              <span className="text-primary">
                ${showSellWindow?.currentPrice}
              </span>
            </div>
            <div className=" grid">
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value > Number(showSellWindow?.amount)) {
                    toast.error(
                      "You only have " +
                        showSellWindow?.amount +
                        " amount of coins."
                    );
                    return;
                  }
                  setQuantity(value);
                }}
                className=" px-6 py-2 rounded-lg outline-none bg-gray-200"
                placeholder="Quantity"
              />
            </div>
            <div className=" grid grid-cols-2">
              <span>Total Price:</span>
              <span className="text-primary">
                ${(showSellWindow?.currentPrice * quantity).toFixed(3)}
              </span>
            </div>
            <button
              onClick={handleSellBtn}
              className=" bg-primary py-2 rounded-lg hover:bg-opacity-90 text-white"
            >
              Sell
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-fit bg-white/80 text-black rounded-2xl text-xs md:text-lg  font-normal md:font-semibold pb-3 overflow-hidden md:p-6 coins-list grid gap-4 shadow-md">
          <div className=" text-xs md:text-xl  font-normal md:font-semibold px-[12px] py-2 md:py-[6px] bg-secondary rounded-md grid grid-cols-5">
            <h1>Name</h1>
            <h1 className=" flex items-center">Buying P<span className=" hidden md:block">rice</span></h1>
            <h1>Amount</h1>
            <h1 className=" flex items-center">Current P<span className=" hidden md:block">rice</span></h1>
            <h1>Sell</h1>
          </div>
          {error ? (
            <p className=" text-red-500 text-center text-xl">{error}</p>
          ) : (
            Object.keys(prices).map((symbol) => {
              const coin = prices[symbol];

              return (
                <div key={symbol} className="list grid-cols-5">
                  <h1 className="heading">{coin.name}:</h1>
                  {/* buying price  */}
                  <p>${coin?.price}</p>
                  <p>{coin?.amount}</p>
                  <p
                    className="price"
                    style={{
                      color:
                        coin.currentPrice === coin?.price
                          ? "black"
                          : coin.currentPrice > coin?.price
                          ? "green"
                          : "red",
                    }}
                  >
                    ${coin.currentPrice}
                  </p>
                  <div>
                    <button
                      onClick={() => {
                        handleSell({
                          symbol,
                          name: coin.name,
                          buyingPrice: coin.price,
                          currentPrice: coin.currentPrice,
                          amount: coin.amount,
                        });
                      }}
                      className=" text-blue-500"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </>
  );
};

export default CryptoPrices;
