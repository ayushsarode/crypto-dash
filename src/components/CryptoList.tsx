"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { FaChevronDown, FaAngleUp } from "react-icons/fa";
import CurrencySelector from "./CurrencySelector";


export interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_7d_in_currency: number;
  image: string;
}

const CryptoTracker: React.FC = () => {
  const [data, setData] = useState<CryptoData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMore, setShowMore] = useState<boolean>(false);
  const [currency, setCurrency] = useState<string>("usd");
  const [loading, setLoading] = useState(true);
  const initialRowCount = 10;

  const apiKey = process.env.NEXT_PUBLIC_CG_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_CRYPTO_API_URL;

  const fetchData = async (currency: string) => {
    try {
      const response = await axios.get<CryptoData[]>(apiUrl, {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: "1h,24h,7d",
        },
        headers: {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-cg-demo-api-key": apiKey,
          },
        },
      });

      setData(response.data as CryptoData[]);
    } catch (error) {
      console.error("Error fetching data:", error);
      error;
    }
  };



  useEffect(() => {
    fetchData(currency);
  }, [currency]);


  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowsToShow = showMore
    ? filteredData
    : filteredData.slice(0, initialRowCount);

  const toggleShowMore = () => setShowMore(!showMore);

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency);
  };

  return (
    <>
      <div className="mx-auto text-center">
        <input
          type="text"
          placeholder="Search Crypto"
          className="input w-full max-w-xs text-black bg-white mr-3 mx-auto"
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <CurrencySelector
          currency={currency}
          onCurrencyChange={handleCurrencyChange}
        />
      </div>

      <div className="container m-auto">
        <div className="m-5 p-10">
          <table className="table mt-7">
            <thead className="bg-dark">
              <tr className="text-white">
                <th className="bg-black">Name</th>
                <th className="bg-black">Symbol</th>
                <th className="bg-black">Price</th>
                <th className="bg-black">Market Cap</th>
                <th className="bg-black">1h Change</th>
                <th className="bg-black">1D Change</th>
                <th className="bg-black">7D Change</th>
              </tr>
            </thead>
            <tbody>
              {rowsToShow.map((crypto) => (
                <tr key={crypto.id}>
                  <td className="text-white">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="rounded-circle mr-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <Link
                      href={`/coin/${crypto.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {crypto.name}
                    </Link>
                  </td>
                  <td className="text-white">{crypto.symbol.toUpperCase()}</td>
                  <td className="text-white">
                    {currency === "usd"
                      ? `$${crypto.current_price.toFixed(2)}`
                      : `₹${crypto.current_price.toFixed(2)}`}
                  </td>
                  <td className="text-white">
                    {currency === "usd"
                      ? `$${crypto.market_cap.toLocaleString("en-US")}`
                      : `₹${crypto.market_cap.toLocaleString("en-IN")}`}
                  </td>
                  <td
                    style={{
                      color:
                        crypto.price_change_percentage_1h_in_currency < 0
                          ? "red"
                          : "green",
                    }}
                  >
                    {crypto.price_change_percentage_1h_in_currency !== null
                      ? `${crypto.price_change_percentage_1h_in_currency.toFixed(
                          2
                        )}%`
                      : "N/A"}
                  </td>
                  <td
                    style={{
                      color:
                        crypto.price_change_percentage_24h_in_currency < 0
                          ? "red"
                          : "green",
                    }}
                  >
                    {crypto.price_change_percentage_24h_in_currency !== null
                      ? `${crypto.price_change_percentage_24h_in_currency.toFixed(
                          2
                        )}%`
                      : "N/A"}
                  </td>
                  <td
                    style={{
                      color:
                        crypto.price_change_percentage_7d_in_currency < 0
                          ? "red"
                          : "green",
                    }}
                  >
                    {crypto.price_change_percentage_7d_in_currency !== null
                      ? `${crypto.price_change_percentage_7d_in_currency.toFixed(
                          2
                        )}%`
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length > initialRowCount && (
            <div className="text-center mt-4">
              <button className="" onClick={toggleShowMore}>
                {showMore ? <FaAngleUp /> : <FaChevronDown />}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CryptoTracker;
