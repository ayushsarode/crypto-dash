"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { truncateText } from "@/utils/truncate";
import DOMPurify from "dompurify";

const Coin = ({ params }: any) => {
  const [coinData, setCoinData] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const Coinid = params.id;

  // fetching dynamic Coin
  useEffect(() => {
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

    if (Coinid) {
      fetchCoinData();
    }
  }, [Coinid]);

  if (error) return <div>{error}</div>;
  if (!coinData)
    return (
      <div className="flex items-center justify-center h-screen ">
        <span className="loading loading-dots loading-lg mb-10"></span>
      </div>
    );

  // HistoricalData for dynamic coins
  const fetchHistoricalData = async () => {
    const options = { method: "GET", headers: { accept: "application/json" } };

    fetch(
      `https://api.coingecko.com/api/v3/coins/${Coinid}/market_chart?vs_currency=usd&days=10`,
      options
    )
      .then((response) => response.json())
      .then((response) => setHistoricalData(response))
      .catch((err) => console.error(err));
  };


  // for read more/less function 
  const description = coinData?.description?.en || "";
  const truncatedDescription = truncateText(description, 60);
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className="card card-side bg-base-100 shadow-xl max-w-[900px] mt-10 max-h-[600px]">
        <figure className="w-[500px]">
          <img
            src={coinData.image.large}
            className="card-img-top img-fluid"
            alt=""
            style={{ maxWidth: "200px" }}
          />
        </figure>
        <div className="card-body">
          <div className="flex items-center gap-5">
            <h1 className="card-title">{coinData.name}</h1>
            <p className="card-text font-bold">
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
          <div className="card-actions justify-end">
            <button className="btn btn-primary">Watch</button>
          </div>
        </div>
      </div>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card">
          <img
            src={coinData.image.small}
            className="card-img-top img-fluid"
            alt=""
            style={{ maxWidth: "60px" }}
          />
          <div className="card-body">
            <h1 className="card-title">{coinData.name}</h1>
            <h5
              className="card-text "
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(coinData.description.en),
              }}
            />
            <p className="card-text">
              <b>Symbol:</b> {coinData.symbol.toUpperCase()}
            </p>
            <p className="card-text">
              <b>Rank:</b> {coinData.market_cap_rank}
            </p>
            <p className="card-text">
              <b>Market Cap:</b> {coinData.market_data.market_cap.inr}
            </p>
            <p className="card-text">
              <b>Current Price:</b> {coinData.market_data.current_price.inr}
            </p>
            <p className="card-text">
              <b>Total Supply:</b> {coinData.market_data.total_supply}
            </p>
            <p className="card-text">
              <b>Market Cap Change (24h):</b>{" "}
              {coinData.market_data.market_cap_change_percentage_24h}%
            </p>
            <p className="card-text">
              <b>High (24h):</b> {coinData.market_data.high_24h.inr}
            </p>
            <p className="card-text">
              <b>Low (24h):</b> {coinData.market_data.low_24h.inr}
            </p>
            <p className="card-text">
              <b>Total Volume (24h):</b> {coinData.market_data.total_volume.inr}
            </p>
            <p className="card-text">
              <b>Circulating Supply:</b>{" "}
              {coinData.market_data.circulating_supply}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Coin;
