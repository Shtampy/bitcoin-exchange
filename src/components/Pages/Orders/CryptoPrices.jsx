// src/components/CryptoPrices.js
import React, { useEffect, useState } from "react";
import "./crypto_prices.css";
import { useDispatch, useSelector } from "react-redux";
import { coinActions } from "../../../store/reducers/coinReducer";
import toast from "react-hot-toast";
import { X } from "lucide-react";

const CryptoPrices = () => {
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  const portfolio = JSON.parse(localStorage.getItem("portfolio")) || null;

  const balance = JSON.parse(localStorage.getItem("userBalance")) || 0;

  const [prices, setPrices] = useState({});
  const [lastPrices, setLastPrices] = useState({});
  const [showBuyWindow, setShowBuyWindow] = useState(null);
  const [quantity, setQuantity] = useState(0);

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
      { symbol: "shibusdt", name: "Shiba Inu" },
      { symbol: "ltcusdt", name: "Litecoin" },
      { symbol: "unibusdt", name: "Uniswap" },
      { symbol: "linkusdt", name: "Chainlink" },
      { symbol: "xemusdt", name: "XEM" },
      { symbol: "vethusdt", name: "VeChain" },
      { symbol: "filusdt", name: "Filecoin" },
      { symbol: "ltcusdt", name: "Litecoin" },
      { symbol: "etcusdt", name: "Ethereum Classic" },
      { symbol: "bchusdt", name: "Bitcoin Cash" },
      { symbol: "lunausdt", name: "Terra" },
      { symbol: "dashusdt", name: "Dash" },
      { symbol: "stmxusdt", name: "StormX" },
      { symbol: "croreusdt", name: "Crypto.com Coin" },
      { symbol: "htusdt", name: "Huobi Token" },
      { symbol: "kavausdt", name: "Kava" },
      { symbol: "nknusdt", name: "NKN" },
      { symbol: "xmrusdt", name: "Monero" },
      { symbol: "zrxusdt", name: "0x" },
      { symbol: "compusdt", name: "Compound" },
      // { symbol: "sushiusdt", name: "SushiSwap" },
      // { symbol: "ftmusdt", name: "Fantom" },
      // { symbol: "icpusdt", name: "Internet Computer" },
      // { symbol: "eosusdt", name: "EOS" },
      // { symbol: "runeusdt", name: "THORChain" }
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

  const handleBuy = (coin) => {
    setShowBuyWindow(coin);
  };

  const handleBuyBtn = () => {
    const totalPrice = showBuyWindow?.price * quantity;
    if (totalPrice > balance) {
      toast.error("Not Enough Balance!");
      setShowBuyWindow(null);
      return;
    }
    const userCurrentBalance = balance - totalPrice;
    localStorage.setItem("userBalance", JSON.stringify(userCurrentBalance));
    let portfolioBody;
    let alreadyExist = false;
    
    if (portfolio) {
      portfolioBody = {
        ...portfolio,
        coins: portfolio.coins.map((item, i) => {
          if (item.symbol === showBuyWindow?.symbol) {
            alreadyExist = true;
            return {
              ...item,
              amount: Number(item?.amount) + Number(quantity),
            };
          }
          return item;
        }),
      };
      if (!alreadyExist) {
        portfolioBody = {
          ...portfolio,
          coins: [
            ...portfolioBody.coins,
            { ...showBuyWindow, amount: quantity }
          ],
        };
      }
    } else {
      portfolioBody = {
        userId: user?.id,
        coins: [{ ...showBuyWindow, amount: quantity }],
      };
    }

    localStorage.setItem("portfolio", JSON.stringify(portfolioBody));
    toast.success(
      "You successfully buy " + quantity + " " + showBuyWindow?.name + "."
    );
    setQuantity(0);
    setShowBuyWindow(null);
    window.location.reload();
  };
  return (
    <>
      {showBuyWindow !== null ? (
        <div className="w-full md:w-[65%] h-fit bg-white/80 text-black rounded-2xl text-base md:text-lg  font-normal md:font-semibold p-6 coins-list grid gap-4 shadow-md relative">
          <X
            onClick={() => {
              setShowBuyWindow(null);
            }}
            className=" cursor-pointer"
            size={32}
          />
          <div className=" p-4 grid gap-4">
            <div className=" grid grid-cols-2">
              <span>Coin Name:</span>
              <span className="text-primary">
                {showBuyWindow?.name} ({showBuyWindow?.symbol})
              </span>
            </div>
            <div className=" grid grid-cols-2">
              <span>Coin Price:</span>
              <span className="text-primary">${showBuyWindow?.price}</span>
            </div>
            <div className=" grid">
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                }}
                className=" px-6 py-2 rounded-lg outline-none bg-gray-200"
                placeholder="Quantity"
              />
            </div>
            <div className=" grid grid-cols-2">
              <span>Total Price:</span>
              <span className="text-primary">
                ${(showBuyWindow?.price * quantity).toFixed(3)}
              </span>
            </div>
            <button
              onClick={handleBuyBtn}
              className=" bg-primary py-2 rounded-lg hover:bg-opacity-90 text-white"
            >
              Buy
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full h-fit bg-white/80 text-black rounded-2xl text-base md:text-lg  font-normal md:font-semibold p-6 coins-list grid gap-4 shadow-md">
          <div className=" text-base md:text-xl  font-normal md:font-semibold px-[12px] py-[6px] bg-secondary rounded-md grid grid-cols-3">
            <h1>Name</h1>
            <h1>Price</h1>
            <h1>Buy</h1>
            {/* <h1>Sell</h1> */}
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
                      handleBuy({ symbol, name: coin.name, price: coin.price });
                    }}
                    className=" text-blue-500"
                  >
                    Buy Coins
                  </button>
                </div>
                {/* <div>
              <button
              onClick={()=>{
                handleSell({symbol, name: coin.name})
              }}
              className=" text-blue-500">
                Sell
              </button>
            </div> */}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default CryptoPrices;
