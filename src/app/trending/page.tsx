"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";
import Image from "next/image";
import { BsFillInfoCircleFill, BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";

interface CryptoData {
  large: string;
  data: any;
  id: string;
  name: string;
  symbol: string;
  image: string;
  score?: number;
  current_price?: number;
  market_cap?: number;
  price_change_percentage_1h?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d?: number;
  usd: number;
}

const formatNumber = (num: number | undefined) => {
  if (num === undefined) return "N/A";
  
  // Ensure num is actually a number
  const numValue = typeof num === 'number' ? num : parseFloat(num);
  
  // Check if conversion resulted in a valid number
  if (isNaN(numValue)) return "N/A";

  // Define thresholds and formatting
  if (numValue >= 1_000_000) return `$${(numValue / 1_000_000).toFixed(2)}M`;
  if (numValue >= 1_000) return `$${(numValue / 1_000).toFixed(2)}K`;
  return `$${numValue.toFixed(2).replace(/\.?0+$/, "")}`;
};

const TrendingPage: React.FC = () => {
  const [trendingData, setTrendingData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const fetchData = async () => {
    try {
      const response = await axios.get<{ coins: { item: CryptoData }[] }>(
        "https://api.coingecko.com/api/v3/search/trending"
      );
      const data = response.data.coins.map((coin, index) => ({
        ...coin.item,
        score: index + 1,
      }));
      setTrendingData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-700 border-l-blue-600 border-r-blue-600 rounded-full animate-spin"></div>
          <p className="text-blue-400 font-medium">Loading market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8 mt-20">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
              Trending Cryptocurrencies
            </h1>
            <p className="text-gray-400 mt-2">
              Top coins by search volume in the last 3 hours
            </p>
          </div>
          <div className="hidden sm:block">
            <div className="bg-gray-800 rounded-lg p-2 flex items-center gap-4 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <span>Market: <span className="text-green-400">Active</span></span>
              </div>
              <div>
                <span className="text-gray-400">BTC Dominance: <span className="text-white">42.3%</span></span>
              </div>
              <button onClick={() => fetchData()} className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-md px-3 py-1 text-white text-sm">
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 shadow-lg backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400 text-sm">
                  <th className="px-6 py-4 text-left">#</th>
                  <th className="px-6 py-4 text-left">Asset</th>
                  <th className="px-6 py-4 text-left">Symbol</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">
                    <div className="flex items-center gap-2">
                      Market Cap
                      <div className="tooltip tooltip-bottom" data-tip="The total market value of a cryptocurrency's circulating supply. Market Cap = Current Price × Circulating Supply.">
                        <BsFillInfoCircleFill className="text-gray-500" />
                      </div>
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left">24h Change</th>
                </tr>
              </thead>
              <tbody>
                {trendingData.map((coin) => (
                  <tr
                    key={coin.id}
                    className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium">{coin.score}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Link href={`/coin/${coin.id}`} className="flex items-center gap-3">
                        <div className="relative w-8 h-8">
                          <Image
                            src={coin.large}
                            alt={coin.name}
                            className="rounded-full"
                            fill
                            sizes="32px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <span className="font-medium hover:text-blue-400 transition-colors">
                          {coin.name}
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm font-medium">
                        {coin.symbol?.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {coin.data.price ? formatNumber(coin.data.price) : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {coin.data.market_cap ? formatNumber(coin.data.market_cap) : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className={`flex items-center ${
                          coin.data.price_change_percentage_24h?.usd < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {coin.data.price_change_percentage_24h?.usd < 0 ? (
                          <BsArrowDownShort size={18} />
                        ) : (
                          <BsArrowUpShort size={18} />
                        )}
                        <span className="font-medium">
                          {coin.data.price_change_percentage_24h?.usd !== undefined
                            ? `${Math.abs(coin.data.price_change_percentage_24h.usd).toFixed(2)}%`
                            : "N/A"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-gray-800 bg-opacity-50 rounded-xl border border-gray-700 p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">About Trending Cryptocurrencies</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The trending list shows cryptocurrencies that are currently generating the most interest
            based on user search volume. These assets have seen significant increases in user
            attention over the past 3 hours, which may indicate emerging market trends or
            news-driven interest. Market conditions can change rapidly, so always conduct thorough
            research before making investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;