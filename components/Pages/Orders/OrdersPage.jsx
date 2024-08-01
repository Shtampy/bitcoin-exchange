import React, { useEffect, useState } from "react";
import LoginPage from "../../Auth/Login/LoginPage";
import videoSrc from "../../../assets/home-video.mp4";
import CryptoPrices from "./CryptoPrices";

export default function OrderPage() {
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  const balance = JSON.parse(localStorage.getItem("userBalance")) || 0;

  const portfolio = JSON.parse(localStorage.getItem("portfolio")) || null;

  if (user === null) {
    window.location.replace("/")
  }
  const getBalance = () => {
    if(!portfolio){
      return 0;
    }
    const coins = portfolio?.coins;
    let balance = 0;
    coins.forEach((coin) => {
      balance += coin?.amount * coin?.price;
    })
    return balance.toFixed(1);
  }
  
  
  return (
    <div className=" w-full min-h-[93.3vh] relative overflow-hidden">
      
      <video
        className={"absolute top-0 left-0 w-full h-full object-cover "}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <div className=" relative z-10 grid place-items-center min-h-[93.3vh] w-full px-4 pb-6 pt-20 md:pt-6 sm:px-12 md:px-24 lg:px-32 xl:px-64">
      <div className=" absolute top-0 right-0 font-bold text-lg sm:text-3xl md:text-4xl lg:text-5xl text-white bg-black/35 p-2 md:py-4 md:px-8 rounded-bl-xl">
        <p className="font-semibold text-xs md:text-sm">Your Balance:</p>
          {(balance).toFixed(1)}$
        </div>
        <div className=" absolute top-0 left-0 font-bold text-lg sm:text-3xl md:text-4xl lg:text-5xl text-white bg-black/35 p-2 md:py-4 md:px-8 rounded-br-xl">
        <p className="font-semibold text-xs md:text-sm">Your Portfolio:</p>
          {getBalance()}$
        </div>
        <CryptoPrices />
      </div>
    </div>
  );
}
