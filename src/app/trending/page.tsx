"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";


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

  // Define thresholds and formatting
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(2)}K`;
  return num.toFixed(2).replace(/\.?0+$/, "");
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
      const data = response.data.coins.map((coin, index) => (
        {
          ...coin.item,
          score: index +1,
        }
      ));
      setTrendingData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

    if (loading) {
    return (<div className="flex items-center justify-center h-screen ">
      <span className="loading loading-dots loading-lg mb-10"></span>
    </div>);
  }



  return isAuthenticated ? (
    <div className="min-w-full sm:min-w-[1200px] mb-5">
  <br />
  <div className="container m-auto px-4">
    <div className="text-left m-4">
      <h1 className="text-2xl text-white font-bold mb-2">Top Trending Cryptocurrencies Today</h1>
      <p className="text-gray-400 text-sm text-wrap">
        Discover the top trending cryptocurrencies on coindash. This list is sorted by coins that are most searched for in the last 3 hours.
      </p>
    </div>
    <div className="overflow-x-auto">
      <table className="table mt-7 w-full">
        <thead className="bg-dark text-sm">
          <tr className="text-white">
            <th className="bg-black px-4 py-2">Score</th>
            <th className="bg-black px-4 py-2">Name</th>
            <th className="bg-black px-4 py-2">Symbol</th>
            <th className="bg-black px-4 py-2">Price</th>
            <th className="bg-black px-4 py-2">Market Cap</th>
            <th className="bg-black px-4 py-2">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {trendingData.map((coin) => (
            <tr key={coin.id} className="
            font-light">
              <td className="text-white px-4 py-2">{coin.score ?? "N/A"}</td>
              <td className="text-white px-4 py-2 flex items-center ">
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
              <td className="text-white px-4 py-2">{coin.symbol?.toUpperCase()}</td>
              <td className="text-white px-4 py-2">
                ${coin.data.price ? formatNumber(coin.data.price) : "N/A"}
              </td>
              <td className="text-white px-4 py-2">{coin.data.market_cap}</td>
              <td
                className="text-white px-4 py-2"
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

  ): (
    <div className="flex justify-center items-center h-[80vh]">
      You have to  <span className="text-blue-700 font-underline underline mx-1"><LoginLink> Login </LoginLink></span> to see this page
    </div>
  );
};

export default TrendingPage;
