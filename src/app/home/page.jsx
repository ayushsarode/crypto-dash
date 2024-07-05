import React from "react";
import RootLayout from "../layout";
import poppins from "@/Styles/Fonts/font";

function Home() {
  return (
    <div className={poppins.className}>
      <div className="hero mt-[5rem] mb-1">
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
 
          </div>
          
        </div>
          </div>
    </div>
  );
}

export default Home;
