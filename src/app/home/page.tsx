"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import poppins from "@/Styles/Fonts/font";
import CryptoTracker from "@/components/CryptoList";
import { HiTrendingUp } from "react-icons/hi";

const Home: React.FC = () => {
  const cryptoRef = useRef<HTMLDivElement>(null);
  
  const scrollToTracker = () => {
    if (cryptoRef.current) {
      window.scrollTo({
        top: cryptoRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  };
  
  return (
    <div className={`${poppins.className} min-h-screen bg-gradient-to-b from-gray-900 to-black`}>
      <div className="relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        
        {/* Hero section */}
        <div className="hero pt-16 mt-12 pb-8 px-4 relative z-10">
          <div className="hero-content text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                Track
                <span className="block mt-2">
                  <span className="bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 text-transparent bg-clip-text bg-[length:200%_200%] animate-gradient-x">
                    Crypto
                  </span>{" "}
                  Instantly
                </span>
              </h1>
              <p className="text-lg text-indigo-100 max-w-lg mx-auto">
                Welcome to the ultimate platform for real-time cryptocurrency tracking.
                Get up-to-date information on prices, market caps, and trends.
              </p>
              <div className="flex justify-center gap-4 mt-6">
                <div className="stat bg-black/30 backdrop-blur-sm border border-indigo-500/20 rounded-xl px-6 py-4">
                  <div className="stat-title text-indigo-300">Cryptocurrencies</div>
                  <div className="stat-value text-white">100+</div>
                </div>
                <div className="stat bg-black/30 backdrop-blur-sm border border-indigo-500/20 rounded-xl px-6 py-4">
                  <div className="stat-title text-indigo-300">Updated</div>
                  <div className="stat-value text-white">Real-time</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Enhanced Floating Button to Scroll Down */}
        <motion.button
  onClick={scrollToTracker}
  whileHover={{ 
    scale: 1.05,
    boxShadow: "0px 0px 20px rgba(132, 90, 223, 0.7)"
  }}
  whileTap={{ scale: 0.95 }}
  className="fixed bottom-6 right-6 z-20
    flex items-center gap-2 px-5 py-3 rounded-xl
    text-white font-medium text-lg
    bg-indigo-700
    transition-all duration-300 ease-out
    shadow-lg shadow-indigo-900/50
    backdrop-blur-sm border border-indigo-500
    group"
>
  <div className="absolute inset-0 rounded-xl bg-black opacity-30 group-hover:opacity-0 transition-opacity"></div>
  <div className="absolute inset-0 rounded-xl bg-indigo-900/80 opacity-0 group-hover:opacity-100 transition-opacity"></div>
  <HiTrendingUp className="text-xl relative z-10" />
  <span className="relative z-10">Live Tracker</span>
  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></div>
</motion.button>
        
        {/* Crypto Tracker Section */}
        <motion.div
          ref={cryptoRef}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <CryptoTracker />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;