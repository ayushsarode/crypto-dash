'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdArrowRightAlt } from "react-icons/md";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components"

interface ExchangeRate {
  name: string;
  unit: string;
  value: number;
  type: string;
}

const ExchangeRates: React.FC = () => {
  const [cryptoRates, setCryptoRates] = useState<{ [key: string]: ExchangeRate }>({});
  const [fiatRates, setFiatRates] = useState<{ [key: string]: ExchangeRate }>({});
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('btc');
  const [toCurrency, setToCurrency] = useState('usd'); 
  const [convertedAmount, setConvertedAmount] = useState(0);
  const { isAuthenticated, isLoading } = useKindeBrowserClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/exchange_rates');
        const rates = response.data.rates;

        const cryptoRates: { [key: string]: ExchangeRate } = {};
        const fiatRates: { [key: string]: ExchangeRate } = {};

        for (const key in rates) {
          if (rates[key].type === 'crypto') {
            cryptoRates[key] = rates[key];
          } else if (rates[key].type === 'fiat') {
            fiatRates[key] = rates[key];
          }
        }

        setCryptoRates(cryptoRates);
        setFiatRates(fiatRates);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (amount > 0 && cryptoRates[fromCurrency] && fiatRates[toCurrency]) {
      const rate = fiatRates[toCurrency].value / cryptoRates[fromCurrency].value;
      setConvertedAmount(amount * rate);
    } else {
      setConvertedAmount(0);
    }
  }, [amount, fromCurrency, toCurrency, cryptoRates, fiatRates]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(event.target.value));
  };

  const handleFromCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(event.target.value);
  };

  if (loading) {
    return (<div className="flex items-center justify-center h-screen ">
      <span className="loading loading-dots loading-lg mb-10"></span>
    </div>);
  }

  return  isAuthenticated ? (
    <div className='mt-[7rem]'>
<div className="max-w-xl flex items-center justify-center mx-auto  p-6 bg-slate-950 shadow-lg rounded-lg h-[25rem] ">
  <div className='items-center'>
  <h1 className="text-2xl font-bold mb-6 text-center text-white">Currency Converter</h1>
  <div className="space-y-6">
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <label className="text-white w-16">From:</label>
        <select 
          value={fromCurrency} 
          onChange={handleFromCurrencyChange} 
          className="p-2 rounded bg-gray-700 text-white flex-grow"
        >
          {Object.keys(cryptoRates).map((key) => (
            <option key={key} value={key}>
              {cryptoRates[key].name} ({cryptoRates[key].unit})
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center space-x-4">
        <label className="text-white w-16">Amount:</label>
        <input 
          type="number" 
          value={amount} 
          onChange={handleAmountChange} 
          className="p-2 rounded bg-gray-700 text-white flex-grow"
          min="0"
          placeholder="Enter amount"
        />
      </div>
      <div className="flex justify-center text-white text-4xl">
  <MdArrowRightAlt />
</div>
      <div className="flex items-center space-x-4">
        <label className="text-white w-16">To:</label>
        <select 
          value={toCurrency} 
          onChange={handleToCurrencyChange} 
          className="p-2 rounded bg-gray-700 text-white flex-grow"
        >
          {Object.keys(fiatRates).map((key) => (
            <option key={key} value={key} className='h-[10rem]'>
              {fiatRates[key].name} ({fiatRates[key].unit})
            </option>
          ))}
        </select>
      </div>
    </div>
    <div className="text-center mt-6">
      <h2 className="text-xl font-semibold text-white">
        {amount > 0 ? (
          <>
            {amount} {cryptoRates[fromCurrency].unit} = 
            {convertedAmount.toFixed(2)} {fiatRates[toCurrency].unit}
          </>
        ) : (
          <>
          <p>
          Please enter an amount
          </p>
          </>
        )}
      </h2>
    </div>
  </div>
  </div>
</div>
</div>


  ): (
    <div className="flex justify-center items-center h-[80vh]">
      You have to  <span className="text-blue-700 font-underline underline mx-1"><LoginLink> Login </LoginLink></span> to see this page
    </div>
  );
};

const CurrencyConverter: React.FC = () => {
  return (
    <div>
      <ExchangeRates />
    </div>
  );
};

export default CurrencyConverter;
