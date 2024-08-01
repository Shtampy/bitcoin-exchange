import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/index.js";
import preloader from './assets/preloader.mp4';

const RootComponent = () => {
  const isPreloaderShown = sessionStorage.getItem("preloader") || false;
  const [showPreloader, setShowPreloader] = useState(isPreloaderShown === "true" ? false : true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPreloader(false);
      sessionStorage.setItem("preloader", "true");
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  return showPreloader ? (
    <div className="relative w-full h-screen grid place-items-center bg-black">
      <video
        className="absolute top-0 left-0 w-full h-full"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={preloader} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>
);
