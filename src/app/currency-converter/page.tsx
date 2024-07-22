'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  const [fromCurrency, setFromCurrency] = useState('btc'); // Default to Bitcoin
  const [toCurrency, setToCurrency] = useState('usd'); // Default to US Dollar
  const [convertedAmount, setConvertedAmount] = useState(0);

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

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Currency Converter</h1>
      <div className="flex flex-col items-center space-y-4">
        <input 
          type="number" 
          value={amount} 
          onChange={handleAmountChange} 
          className="w-full p-2 border border-gray-300 rounded"
          min="0"
        />
        <div className="flex items-center space-x-2">
          <select 
            value={fromCurrency} 
            onChange={handleFromCurrencyChange} 
            className="p-2 border border-gray-300 rounded"
          >
            {Object.keys(cryptoRates).map((key) => (
              <option key={key} value={key}>
                {cryptoRates[key].name} ({cryptoRates[key].unit})
              </option>
            ))}
          </select>
          <span className="text-xl">to</span>
          <select 
            value={toCurrency} 
            onChange={handleToCurrencyChange} 
            className="p-2 border border-gray-300 rounded"
          >
            {Object.keys(fiatRates).map((key) => (
              <option key={key} value={key}>
                {fiatRates[key].name} ({fiatRates[key].unit})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h2 className="text-xl font-semibold">
          {amount > 0 ? (
            <>
              {amount} {cryptoRates[fromCurrency].unit} = {convertedAmount.toFixed(2)} {fiatRates[toCurrency].unit}
            </>
          ) : (
            'Please enter an amount greater than zero'
          )}
        </h2>
      </div>
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
