import React, { useEffect, useState } from "react";
import videoSrc from "../../../assets/fav_page.mp4";
import CryptoPrices from "./CryptoPrices";

export default function FavPage() {
  const user = JSON.parse(sessionStorage.getItem("user")) || null;

  if (user === null) {
    window.location.replace("/")
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
      
      <div className=" relative z-10 grid place-items-center min-h-[93.3vh] w-full px-4 py-6 sm:px-12 md:px-24 lg:px-32 xl:px-64">
        <CryptoPrices />
      </div>
    </div>
  );
}
