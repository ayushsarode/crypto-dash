"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { truncateText } from "../../../lib/truncate";
import Image from "next/image";
import { Inter, Roboto } from "next/font/google";
import { FaCaretUp, FaCaretDown, FaExternalLinkAlt } from "react-icons/fa";
import { 
  FaChartLine, 
  FaMoneyBillWave, 
  FaRegClock, 
  FaExchangeAlt, 
  FaInfoCircle
} from "react-icons/fa";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const Coin = ({ params }: any) => {
  const [coinData, setCoinData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeFrame, setTimeFrame] = useState("1M"); // "24H", "7D", "1M", "3M", "1Y"
  const [currency, setCurrency] = useState("usd");
  const Coinid = params.id;

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${Coinid}`
        );
        setCoinData(response.data);
      } catch (error) {
        setError("Error loading coin data");
      }
    };

    const fetchHistoricalData = async () => {
      try {
        // Convert timeFrame to days
        let days = 30; // Default: 1M
        if (timeFrame === "24H") days = 1;
        if (timeFrame === "7D") days = 7;
        if (timeFrame === "3M") days = 90;
        if (timeFrame === "1Y") days = 365;

        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${Coinid}/market_chart?vs_currency=${currency}&days=${days}`,
          {
            headers: { accept: "application/json" },
          }
        );
        setHistoricalData(response.data);
        
        // Format data for the chart
        if (response.data && response.data.prices) {
          const formattedData = response.data.prices.map((item: any) => {
            const date = new Date(item[0]);
            let dateString = '';
            
            if (timeFrame === "24H") {
              dateString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            } else {
              dateString = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
            }
            
            return {
              date: dateString,
              price: item[1]
            };
          });
          
          // Sample data for better visualization
          let sampledData;
          if (formattedData.length > 100) {
            const step = Math.floor(formattedData.length / 100);
            sampledData = formattedData.filter((_: any, i: number) => i % step === 0);
          } else {
            sampledData = formattedData;
          }
          
          setChartData(sampledData);
        }
      } catch (error) {
        console.error("Error fetching historical data:", error);
        setError("Error loading price history");
      }
    };

    if (Coinid) {
      fetchCoinData();
      fetchHistoricalData();
    }
  }, [Coinid, timeFrame, currency]);

  if (error) return (
    <div className="flex items-center justify-center h-screen text-red-500 text-xl">
      <FaInfoCircle className="mr-2" /> {error}
    </div>
  );
  
  if (!coinData || !historicalData)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin"></div>
        <p className="mt-4 text-indigo-100">Loading cryptocurrency data...</p>
      </div>
    );

  const description = coinData?.description?.en || "";
  const truncatedDescription = truncateText(description, 150);
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const priceChangeColor = (value: number) => {
    return value < 0 ? "text-red-500" : "text-green-500";
  };

  
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950/20 to-black py-8 px-4">
        <Link 
          href="/" 
          className="inline-flex items-center mb-6 text-indigo-300 hover:text-indigo-100 transition-colors"
        >
          &larr; Back to All Cryptocurrencies
        </Link>
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Coin Info */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-500/20">
              <div className="flex items-center space-x-3 mb-6">
                <Image
                  src={coinData.image.large}
                  className="rounded-full"
                  alt={coinData.name}
                  width={48}
                  height={48}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-white">{coinData.name}</h1>
                    <span className="bg-gray-700 text-white rounded px-2 py-1 text-xs">
                      #{coinData.market_cap_rank}
                    </span>
                  </div>
                  <p className="text-gray-300">{coinData.symbol.toUpperCase()}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <h2 className="text-4xl font-bold text-white">
                    ${coinData.market_data.current_price[currency].toLocaleString("en-US", { 
                      minimumFractionDigits: 2, 
                      maximumFractionDigits: 
                        coinData.market_data.current_price[currency] < 1 ? 6 : 2 
                    })}
                  </h2>
                  <span
                    className={`ml-3 flex items-center ${priceChangeColor(coinData.market_data.price_change_percentage_24h)}`}
                  >
                    {coinData.market_data.price_change_percentage_24h < 0 ? (
                      <FaCaretDown className="mr-1" />
                    ) : (
                      <FaCaretUp className="mr-1" />
                    )}
                    {Math.abs(coinData.market_data.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </div>
                <p className="text-sm text-gray-400">
                  Updated: {new Date().toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center">
                    <FaMoneyBillWave className="mr-2" /> Market Cap
                  </span>
                  <span className="text-white font-medium">
                    ${coinData.market_data.market_cap[currency].toLocaleString("en-US")}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center">
                    <FaExchangeAlt className="mr-2" /> Trading Volume (24h)
                  </span>
                  <span className="text-white font-medium">
                    ${coinData.market_data.total_volume[currency].toLocaleString("en-US")}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400 flex items-center">
                    <FaRegClock className="mr-2" /> Circulating Supply
                  </span>
                  <span className="text-white font-medium">
                    {coinData.market_data.circulating_supply.toLocaleString("en-US")} {coinData.symbol.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">24h High</span>
                  <span className="text-green-500 font-medium">
                    ${coinData.market_data.high_24h[currency].toLocaleString("en-US")}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-700">
                  <span className="text-gray-400">24h Low</span>
                  <span className="text-red-500 font-medium">
                    ${coinData.market_data.low_24h[currency].toLocaleString("en-US")}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-400">Price Change (7d)</span>
                  <span className={priceChangeColor(coinData.market_data.price_change_percentage_7d)}>
                    {coinData.market_data.price_change_percentage_7d?.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              {coinData.links?.homepage[0] && (
                <a 
                  href={coinData.links.homepage[0]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full mt-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                >
                  Visit Official Website <FaExternalLinkAlt className="ml-2" />
                </a>
              )}
            </div>
          </div>
          
          {/* Chart and Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-500/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaChartLine className="mr-2" /> Price Chart
                </h2>
                <div className="flex gap-2">
                  {["24H", "7D", "1M", "3M", "1Y"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setTimeFrame(period)}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        timeFrame === period 
                          ? "bg-indigo-600 text-white" 
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="h-72">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#9ca3af' }} 
                        tickLine={{ stroke: '#4b5563' }}
                        axisLine={{ stroke: '#4b5563' }}
                        minTickGap={15}
                      />
                      <YAxis 
                        domain={['auto', 'auto']} 
                        tick={{ fill: '#9ca3af' }}
                        tickLine={{ stroke: '#4b5563' }}
                        axisLine={{ stroke: '#4b5563' }}
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                      />
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#111827', 
                          borderColor: '#6366f1',
                          borderRadius: '0.5rem',
                          color: '#f9fafb'
                        }} 
                        formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Price']}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="price" 
                        stroke="#6366f1" 
                        fillOpacity={1} 
                        fill="url(#colorPrice)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No price data available
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-500/20">
              <h2 className="text-xl font-bold text-white mb-4">About {coinData.name}</h2>
              <div 
                className={`text-gray-300 prose prose-invert max-w-none ${!isExpanded && 'line-clamp-4'}`}
                dangerouslySetInnerHTML={{ __html: description }}
              />
              {description.length > 0 && (
                <button 
                  onClick={handleToggle} 
                  className="mt-4 text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
            
            {/* Price Change Stats */}
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-indigo-500/20">
              <h2 className="text-xl font-bold text-white mb-4">Price Changes</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['24h', '7d', '14d', '30d', '60d', '200d', '1y'].map((period) => {
                  const value = coinData.market_data[`price_change_percentage_${period}`];
                  if (value === undefined) return null;
                  
                  return (
                    <div key={period} className="p-4 bg-gray-800/50 rounded-xl">
                      <p className="text-gray-400 text-sm mb-1">{period.toUpperCase()}</p>
                      <p className={`text-lg font-medium flex items-center ${priceChangeColor(value)}`}>
                        {value < 0 ? <FaCaretDown className="mr-1" /> : <FaCaretUp className="mr-1" />}
                        {Math.abs(value).toFixed(2)}%
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    
  }

export default Coin;