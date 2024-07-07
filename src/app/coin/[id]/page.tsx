// pages/coin/[id].tsx
"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

const Coin = ({ params }: any) => {
  const [coinData, setCoinData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const id = params.id;

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const response = await axios.get(
          `https://api.coingecko.com/api/v3/coins/${id}`
        );
        setCoinData(response.data);
      } catch (error) {
        setError("Error loading data");
      }
    };

    if (id) {
      fetchCoinData();
    }
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!coinData) return <div>Loading...</div>;

  return (
    <>
      <div className="container mt-5 d-flex justify-content-center">
        <div className="card">
          <img
            src={coinData.image.small}
            className="card-img-top img-fluid"
            alt=""
            style={{ maxWidth: "200px" }}
          />
          <div className="card-body">
            <h1 className="card-title">{coinData.name}</h1>
            <h5 className="card-text">{coinData.description.en}</h5>
            <p className="card-text">
              <b>Symbol:</b>
              {coinData.symbol.toUpperCase()}
            </p>
            <p className="card-text">
              <b>Rank:</b>
              {coinData.market_cap_rank}
            </p>
            <p className="card-text">
              <b>Market Cap:</b>
              {coinData.market_data.market_cap.inr}
            </p>
            <p className="card-text">
              <b>Current Price:</b>
              {coinData.market_data.current_price.inr}
            </p>
            <p className="card-text">
              <b>Total Supply:</b>
              {coinData.market_data.total_supply}
            </p>
            <p className="card-text">
              <b>Market Cap Change (24h):</b>
              {coinData.market_data.market_cap_change_percentage_24h}%
            </p>
            <p className="card-text">
              <b>High (24h):</b>
              {coinData.market_data.high_24h.inr}
            </p>
            <p className="card-text">
              <b>Low (24h):</b>
              {coinData.market_data.low_24h.inr}
            </p>
            <p className="card-text">
              <b>Total Volume (24h):</b>
              {coinData.market_data.total_volume.inr}
            </p>
            <p className="card-text">
              <b>Circulating Supply:</b>
              {coinData.market_data.circulating_supply}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Coin;
