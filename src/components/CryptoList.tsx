"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CurrencySelector from "./CurrencySelector";
import Image from "next/image";

export interface CryptoData {
  large: string;
  data: any;
  score: string;
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_1h_in_currency: number;
  price_change_percentage_24h_in_currency: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency: number;
  image: string;
}

const CryptoTracker: React.FC = () => {
  const [data, setData] = useState<CryptoData[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currency, setCurrency] = useState<string>("usd");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(7);

  const apiKey = process.env.NEXT_PUBLIC_CG_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_CRYPTO_API_URL;

  const fetchData = async (currency: string) => {
    try {
      const response = await axios.get<CryptoData[]>(apiUrl, {
        mode: 'no-cors',
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: "1h,24h,7d",
        }
      });

      setData(response.data as CryptoData[]);
      setLoading(false);
    } catch (error) { 
      console.error("Error fetching data:", error); 
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchData(currency);
  }, [currency]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on search query change
  };

  const filteredData = data.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency);
  };

  if (loading) {
    return (<div className="flex items-start justify-center h-screen ">
      <span className="loading loading-dots loading-lg mb-10"></span>
    </div>);
  }

  return (
    <>
      <div>
        <div className="mx-auto text-center w-full">
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

        <div className="container m-auto mb-0 ">
          <div className="m-5 pb-0 p-10">
            <table className="table mb-0 w-full overflow-scroll">
              <thead className="bg-dark ">
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
                {currentItems.map((crypto) => (
                  <tr key={crypto.id}>
                    <td className="text-white">
                      <Image
                        src={crypto.image}
                        alt={crypto.name}
                        className="rounded-circle mr-2"
                        width={30}
                        height={30}
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

            <div className="flex justify-between items-center mt-4">
              <button
                className="btn rounded-full"
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              <span className="text-md">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn rounded-full"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CryptoTracker;
