"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { truncateText } from "../../../lib/truncate";
import DOMPurify from "dompurify";
import LineGraph from "@/components/LineGraph";
import { Days } from "@/components/Days";
import { Card } from "@nextui-org/react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";


const Coin = ({ params }: any) => {
  const [coinData, setCoinData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [days, setDays] = useState(10);
  const Coinid = params.id;
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  const fetchCoinData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${Coinid}`
      );
      setCoinData(response.data);
    } catch (error) {
      setError("Error loading data");
    }
  };


  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${Coinid}/market_chart?vs_currency=USD&days=365`,
        {
          headers: { accept: "application/json" },
        }
      );
      setHistoricalData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (Coinid) {
      fetchCoinData();
    }
    fetchHistoricalData();
  }, [Coinid, fetchCoinData, fetchHistoricalData]);

  if (error) return <div>{error}</div>;
  if (!coinData)
    return (
      <div className="flex items-center justify-center h-screen ">
        <span className="loading loading-dots loading-lg mb-10"></span>
      </div>
    );


  const description = coinData?.description?.en || "";
  const truncatedDescription = truncateText(description, 60);
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  if (coinData && historicalData) {
    return isAuthenticated ?(
      <>
        <div className="card card-side mx-auto bg-gray-900  shadow-xl max-w-[900px] mt-10 max-h-600px] ">
          <figure className="w-[500px]">
            <img
              src={coinData.image.large}
              className="card-img-top img-fluid"
              alt=""
              style={{ maxWidth: "100px" }}
            />
          </figure>
          <div className="card-body max-w-[700px]">
            <div className="flex items-center gap-5">
              <h1 className="card-title text-white">{coinData.name}</h1>
              <p className="card-text font-bold text-white text-xl">
                <b>Rank:</b> {coinData.market_cap_rank}
              </p>
            </div>
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: isExpanded
                  ? DOMPurify.sanitize(description)
                  : DOMPurify.sanitize(truncatedDescription),
              }}
            />
            {description.split(" ").length > 30 && (
              <span>
                <button onClick={handleToggle}>
                  {isExpanded ? "View Less" : "View More"}
                </button>
              </span>
            )}
            <div>
              {Days.map((day) => (
                <button
                  className={`w-24 ml-6 h-10 mb-10 rounded ${
                    days != day.value
                      ? "border-[2px] border-accent text-white"
                      : "bg-accent text-black"
                  }`}
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                  }}
                >
                  {day.label}
                </button>
              ))}
            </div>
            <div>
              <LineGraph historicalData={historicalData} />
            </div>
          </div>
        </div>
      </>
    ): (
      <div className="flex justify-center items-center h-[80vh]">
        You have to  <span className="text-blue-700 font-underline underline mx-1"><LoginLink> Login </LoginLink></span> to see this page
      </div>
    );
  }}

export default Coin
