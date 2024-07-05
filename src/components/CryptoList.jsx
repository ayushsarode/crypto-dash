"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const CryptoTracker = () => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMore, setShowMore] = useState(false);

  const initialRowCount = 10; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=1h%2C24h%2C7d"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = data.filter((crypto) =>
    crypto.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rowsToShow = showMore ? filteredData : filteredData.slice(0, initialRowCount);

  const toggleShowMore = () => setShowMore(!showMore);

  return (
    <>
      <div className="mx-auto text-center bg-black">
        <input
          type="text"
          placeholder="Search Crypto"
          className="input w-full max-w-xs text-black bg-white mr-3 mx-auto"
          value={searchQuery}
          onChange={handleSearchChange}
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
                <th className="bg-black">1h change</th>
                <th className="bg-black">1D change</th>
                <th className="bg-black">7D Change</th>
              </tr>
            </thead>
            <tbody>
              {rowsToShow.map((crypto) => (
                <tr key={crypto.id}>
                  <td>
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="rounded-circle mr-2"
                      style={{ width: "30px", height: "30px" }}
                    />
                    <Link
                      href={`/crypto/${crypto.id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {crypto.name}
                    </Link>
                  </td>
                  <td>{crypto.symbol.toUpperCase()}</td>
                  <td>₹{crypto.current_price.toFixed(2)}</td>
                  <td>₹{crypto.market_cap.toLocaleString("en-US")}</td>
                  <td
                    style={{
                      color:
                        crypto.price_change_percentage_1h_in_currency < 0
                          ? "red"
                          : "green",
                    }}
                  >
                    {Number(
                      crypto.price_change_percentage_1h_in_currency
                    ).toFixed(2)}
                    %
                  </td>
                  <td
                    style={{
                      color:
                        crypto.price_change_percentage_24h_in_currency < 0
                          ? "red"
                          : "green",
                    }}
                  >
                    {Number(
                      crypto.price_change_percentage_24h_in_currency
                    ).toFixed(2)}
                    %
                  </td>
                  <td
                    style={{
                      color:
                        crypto.price_change_percentage_7d_in_currency < 0
                          ? "red"
                          : "green",
                    }}
                  >
                    {Number(
                      crypto.price_change_percentage_7d_in_currency
                    ).toFixed(2)}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredData.length > initialRowCount && (
            <div className="text-center mt-4">
              <button
                className="btn btn-primary"
                onClick={toggleShowMore}
              >
                {showMore ? "View Less" : "View More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CryptoTracker;
