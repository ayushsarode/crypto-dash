"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaSearch } from "react-icons/fa";
import { BsFillInfoCircleFill, BsArrowUpShort, BsArrowDownShort } from "react-icons/bs";
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

  const apiUrl =
    process.env.NEXT_PUBLIC_CRYPTO_API_URL ||
    "https://api.coingecko.com/api/v3/coins/markets";

  const fetchData = async (currency: string) => {
    try {
      setLoading(true);
      const response = await axios.get<CryptoData[]>(apiUrl, {
        params: {
          vs_currency: currency,
          order: "market_cap_desc",
          per_page: 100,
          page: 1,
          sparkline: false,
          price_change_percentage: "1h,24h,7d",
        },
      });

      setData(response.data as CryptoData[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
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
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrency(currency);
  };

  const formatPrice = (price: number) => {
    if (price === undefined || price === null) return "N/A";
    
    // Ensure price is a number
    const priceValue = typeof price === 'number' ? price : parseFloat(price);
    
    // Check if conversion resulted in a valid number
    if (isNaN(priceValue)) return "N/A";
    
    if (priceValue >= 1) return priceValue.toFixed(2);
    if (priceValue >= 0.001) return priceValue.toFixed(4);
    return priceValue.toFixed(6);
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap === undefined || marketCap === null) return "N/A";
    
    // Ensure marketCap is a number
    const capValue = typeof marketCap === 'number' ? marketCap : parseFloat(marketCap);
    
    // Check if conversion resulted in a valid number
    if (isNaN(capValue)) return "N/A";
    
    if (capValue >= 1e12) return `${(capValue / 1e12).toFixed(2)}T`;
    if (capValue >= 1e9) return `${(capValue / 1e9).toFixed(2)}B`;
    if (capValue >= 1e6) return `${(capValue / 1e6).toFixed(2)}M`;
    if (capValue >= 1e3) return `${(capValue / 1e3).toFixed(2)}K`;
    return capValue.toFixed(2);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 mt-12">
        <div className="w-16 h-16 border-4 border-t-blue-500 border-blue-200/30 rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-400">Loading market data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="bg-gradient-to-r from-gray-900 to-black/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-gray-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search Cryptocurrency"
              className="input w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 backdrop-blur-md border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <CurrencySelector
            currency={currency}
            onCurrencyChange={handleCurrencyChange}
          />
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-900 text-left text-gray-300 font-medium py-4 px-4 rounded-tl-lg">#</th>
                <th className="bg-gray-900 text-left text-gray-300 font-medium py-4 px-4">Name</th>
                <th className="bg-gray-900 text-left text-gray-300 font-medium py-4 px-4">Price</th>
                <th className="bg-gray-900 text-left text-gray-300 font-medium py-4 px-4">
                  <div className="flex items-center gap-2">
                    Market Cap
                    <div
                      className="tooltip tooltip-bottom font-medium"
                      data-tip="The total market value of a cryptocurrency's circulating supply. Market Cap = Current Price x Circulating Supply."
                    >
                      <BsFillInfoCircleFill className="text-gray-500" />
                    </div>
                  </div>
                </th>
                <th className="bg-gray-900 text-left text-gray-300 font-medium py-4 px-4">1h %</th>
                <th className="bg-gray-900 text-left text-gray-300 font-medium py-4 px-4">24h %</th>
                <th className="bg-gray-900 text-left text-gray-300 font-medium py-4 px-4 rounded-tr-lg">7d %</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((crypto, index) => (
                <tr 
                  key={crypto.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                >
                  <td className="text-gray-300 py-4 px-4">
                    {indexOfFirstItem + index + 1}
                  </td>
                  <td className="py-4 px-4">
                    <Link
                      href={`/coin/${crypto.id}`}
                      className="flex items-center gap-3 hover:text-blue-400 transition-colors"
                    >
                      <div className="relative w-8 h-8">
                        <Image
                          src={crypto.image}
                          alt={crypto.name}
                          fill
                          sizes="32px"
                          className="rounded-full"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white">{crypto.name}</p>
                        <p className="text-gray-400 text-sm">{crypto.symbol.toUpperCase()}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="text-white font-medium py-4 px-4">
                    {currency === "usd" ? "$" : "₹"}
                    {formatPrice(crypto.current_price)}
                  </td>
                  <td className="text-gray-300 py-4 px-4">
                    {currency === "usd"
                      ? `$${formatMarketCap(crypto.market_cap)}`
                      : `₹${formatMarketCap(crypto.market_cap)}`}
                  </td>
                  <td className="font-medium py-4 px-4">
                    <div className={`flex items-center ${
                      crypto.price_change_percentage_1h_in_currency < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}>
                      {crypto.price_change_percentage_1h_in_currency < 0 ? 
                        <BsArrowDownShort size={16} /> : 
                        <BsArrowUpShort size={16} />
                      }
                      <span>
                        {crypto.price_change_percentage_1h_in_currency !== null
                          ? `${Math.abs(crypto.price_change_percentage_1h_in_currency).toFixed(2)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="font-medium py-4 px-4">
                    <div className={`flex items-center ${
                      crypto.price_change_percentage_24h_in_currency < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}>
                      {crypto.price_change_percentage_24h_in_currency < 0 ? 
                        <BsArrowDownShort size={16} /> : 
                        <BsArrowUpShort size={16} />
                      }
                      <span>
                        {crypto.price_change_percentage_24h_in_currency !== null
                          ? `${Math.abs(crypto.price_change_percentage_24h_in_currency).toFixed(2)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="font-medium py-4 px-4">
                    <div className={`flex items-center ${
                      crypto.price_change_percentage_7d_in_currency < 0
                        ? "text-red-500"
                        : "text-green-500"
                    }`}>
                      {crypto.price_change_percentage_7d_in_currency < 0 ? 
                        <BsArrowDownShort size={16} /> : 
                        <BsArrowUpShort size={16} />
                      }
                      <span>
                        {crypto.price_change_percentage_7d_in_currency !== null
                          ? `${Math.abs(crypto.price_change_percentage_7d_in_currency).toFixed(2)}%`
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button
            className="btn bg-gray-800 hover:bg-gray-700 text-white border-none rounded-full px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            onClick={handlePrevPage}
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Calculate page numbers to show around current page
              let pageNumber;
              if (totalPages <= 5) {
                pageNumber = i + 1;
              } else if (currentPage <= 3) {
                pageNumber = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNumber = totalPages - 4 + i;
              } else {
                pageNumber = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>
          
          <button
            className="btn bg-gray-800 hover:bg-gray-700 text-white border-none rounded-full px-4 py-2 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next <FaChevronRight />
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm mt-4">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} cryptocurrencies
        </div>
      </div>
    </div>
  );
};

export default CryptoTracker;