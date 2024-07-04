import React from "react";
import RootLayout from "../layout";
import poppins from "@/Styles/Fonts/font";

function Home() {
  return (
    <div className={poppins.className}>
      <div className="hero mt-[5rem] mb-5">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold whitespace-nowrap mb-4">
              Track
              <br /> <span className="text-purple-700">Crypto</span> Instantly
            </h1>
            <p className="py-6">
              Welcome to the ultimate platform for real-time cryptocurrency
              tracking.
            </p>
            <form action="" className="px-3 py-2">
              <input
                type="text"
                placeholder="Search Crypto"
                className="input w-full max-w-xs text-black bg-white mr-3 "
              />

              <button className="btn border-none text-white bg-purple-700 hover:text-black hover:bg-white">
                Search
              </button>
            </form>
          </div>
          
        </div>
        
      </div>
      <div className="max-w-[800px] m-auto p-3 bg-gradient-to-r from-custom4 to-custom5" >
            <div className="grid [grid-template-columns:0.5fr_2fr_1fr_1fr_1.5fr] p-[15px 20px] px-2">
              <p>#</p>
              <p>Coins</p>
              <p>Price</p>
              <p className="text-center">24H Change</p>
              <p className="text-right">Market Cap</p>
            </div>
          </div>
    </div>
  );
}

export default Home;
