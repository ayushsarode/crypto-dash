import React from 'react';
import axios from 'axios';
import BackBtn from '@/components/BackBtn';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
}

async function fetchTrendingData(): Promise<CryptoData[]> {
  const res = await axios.get('https://api.coingecko.com/api/v3/search/trending');
  return res.data.coins.map((coin: any) => coin.item);
}

export default async function TrendingPage() {
  const trendingCoin = await fetchTrendingData();

  return (
    <div className='min-w-[1200px]'>
      <h1 className='text-center text-2xl text-white'>Top Trending Cryptocurrencies Today</h1>
      <p className='text-center'>Discover the top trending cryptocurrencies on CoinGecko. This list is sorted by coins that are most searched for in the last 3 hours.</p>
      <br />
      <BackBtn/>
      <table className='min-w-[1200px] text-white table'>
        <thead>
          <tr>
            <th className='py-2 px-4 border-b'>Name</th>
            <th className='py-2 px-4 border-b'>Symbol</th>
          </tr>
        </thead>
        <tbody>
          {trendingCoin.map((coin) => (
            <tr key={coin.id}>
              <td className='py-2 px-4 border-b'>{coin.name}</td>
              <td className='py-2 px-4 border-b'>{coin.symbol}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
