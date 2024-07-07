import React from "react";
import poppins from "@/Styles/Fonts/font";
import CryptoTracker from "@/components/CryptoList";

const Home: React.FC = () => {
  return (
    <div className={poppins.className}>
      <div className="hero mt-[5rem] mb-1">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold whitespace-nowrap mb-4 text-white">
              Track
              <br /> <span className="text-purple-700">Crypto</span> Instantly
            </h1>
            <p className="py-6 text-white">
              Welcome to the ultimate platform for real-time cryptocurrency
              tracking.
            </p>
          </div>
        </div>
      </div>

        <CryptoTracker/>
    </div>
  );
};

export default Home;
