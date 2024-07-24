"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

interface CryptoData {
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

// Custom formatting function
const formatNumber = (num: number | undefined) => {
  if (num === undefined) return "N/A";

  // Define thresholds and formatting
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(2).replace(/\.?0+$/, ""); // Remove trailing zeros
};

const TrendingPage: React.FC = () => {
  const [trendingData, setTrendingData] = useState<CryptoData[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get<{ coins: { item: CryptoData }[] }>(
        "https://api.coingecko.com/api/v3/search/trending"
      );
      const data = response.data.coins.map((coin, index) => (
        {
          ...coin.item,
          score: index +1,
        }
      ));
      setTrendingData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-w-[1200px]">
      
      <br />

      <div className="container m-auto">
      <div className="text-left">
        <h1 className="text-2xl text-white font-bold mb-2 ">
          Top Trending Cryptocurrencies Today
        </h1>
        <p className="text-gray-400 text-sm">
          Discover the top trending cryptocurrencies on coindash. This list is
          sorted by coins that are most searched for in the last 3 hours.
        </p>
      </div>
        <div className="">
          <table className="table mt-7">
            <thead className="bg-dark text-sm">
              <tr className="text-white">
                <th className="bg-black">Score</th>
                <th className="bg-black">Name</th>
                <th className="bg-black">Symbol</th>
                <th className="bg-black">Price</th>
                <th className="bg-black">Market Cap</th>
                <th className="bg-black">24h Change</th>
              </tr>
            </thead>
            <tbody>
              {trendingData.map((coin) => (
                <tr key={coin.id}>
                  <td className="text-white">{coin.score ?? "N/A"}</td>
                  <td className="text-white">
                    <img
                      src={coin.large}
                      alt={coin.name}
                      className="rounded-circle mr-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <Link
                      href={`/coin/${coin.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {coin.name}
                    </Link>
                  </td>
                  <td className="text-white">{coin.symbol?.toUpperCase()}</td>
                  <td className="text-white">
                    {coin.data.price ? formatNumber(coin.data.price) : "N/A"}
                  </td>
                  <td className="text-white">{coin.data.market_cap}</td>
                  <td
                    className="text-white"
                    style={{
                      color:
                        coin.data.price_change_percentage_24h.usd &&
                        coin.data.price_change_percentage_24h.usd < 0
                          ? "red"
                          : "green",
                    }}
                  >
                    {coin.data.price_change_percentage_24h.usd !== undefined
                      ? `${coin.data.price_change_percentage_24h.usd.toFixed(2)}%`
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
