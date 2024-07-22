"use client";
import React from "react";
import poppins from "@/Styles/Fonts/font";
import CryptoTracker from "@/components/CryptoList";
import { GradientText } from "@/components/ui/Gradient-ui";
import { RiCopperCoinLine } from "react-icons/ri";
import { Vortex } from "@/components/ui/vortex";

const Home: React.FC = () => {
  return (
    <div className={poppins.className}>
      <div>
        <div className="hero  mb-1 overflow-hidden">
          <div className="hero-content text-center">
            <Vortex
              backgroundColor="black"
              rangeY={800}
              particleCount={100}
              baseHue={250}
              className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-full"
            >
              <div className="max-w-md mt-[4rem]">
                <h1 className="text-5xl font-bold whitespace-nowrap mb-4 text-white">
                  Track
                  <br />{" "}
                  <span className="bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 text-transparent bg-clip-text bg-[length:200%_200%] animate-gradient-x">
                    Crypto{" "}
                  </span>
                  Instantly
                </h1>
                <p className="py-6 text-white">
                  Welcome to the ultimate platform for real-time cryptocurrency
                  tracking.
                </p>
              </div>
            </Vortex>
          </div>
        </div>
        <CryptoTracker />
      </div>
    </div>
  );
};

export default Home;
