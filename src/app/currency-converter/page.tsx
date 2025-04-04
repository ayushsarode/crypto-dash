'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MdArrowRightAlt, MdSwapHoriz, MdCurrencyExchange } from "react-icons/md";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/components";

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

  const swapCurrencies = () => {
    // Currently we can only swap if "toCurrency" is a crypto
    if (cryptoRates[toCurrency]) {
      const temp = fromCurrency;
      setFromCurrency(toCurrency);
      setToCurrency(temp);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-white text-lg">Loading exchange rates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-t from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-5xl backdrop-blur-md bg-slate-900/70 shadow-2xl rounded-xl overflow-hidden border border-slate-700">
        <div className="flex flex-col md:flex-row">
          {/* Header - Full Width */}
          <div className="w-full bg-slate-800 p-4">
            <div className="flex items-center justify-center">
              <MdCurrencyExchange className="text-blue-500 text-3xl mr-3" />
              <h1 className="text-2xl font-bold text-white">Crypto Converter</h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row">
          {/* Left Side - Conversion Form */}
          <div className="md:w-2/3 p-6">
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
              {/* From Currency Section */}
              <div className="flex-1 bg-slate-800/80 p-4 rounded-xl">
                <label className="block text-sm font-medium text-slate-400 mb-2">From</label>
                <select
                  value={fromCurrency}
                  onChange={handleFromCurrencyChange}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                >
                  {Object.keys(cryptoRates).map((key) => (
                    <option key={key} value={key}>
                      {cryptoRates[key].name} ({cryptoRates[key].unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={swapCurrencies}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all duration-200 transform hover:scale-110"
                >
                  <MdSwapHoriz className="text-2xl" />
                </button>
              </div>

              {/* To Currency Section */}
              <div className="flex-1 bg-slate-800/80 p-4 rounded-xl">
                <label className="block text-sm font-medium text-slate-400 mb-2">To</label>
                <select
                  value={toCurrency}
                  onChange={handleToCurrencyChange}
                  className="w-full p-3 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                >
                  {Object.keys(fiatRates).map((key) => (
                    <option key={key} value={key}>
                      {fiatRates[key].name} ({fiatRates[key].unit})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mt-4 bg-slate-800/80 p-4 rounded-xl">
              <label className="block text-sm font-medium text-slate-400 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className="w-full p-3 rounded-lg bg-slate-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                min="0"
                placeholder="Enter amount"
              />
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="md:w-1/3 bg-gradient-to-br from-blue-900/40 to-purple-900/40 p-6 border-t md:border-t-0 md:border-l border-blue-800/30">
            <h2 className="text-lg font-medium text-slate-300 mb-4">Conversion Result</h2>
            {amount > 0 ? (
              <div className="flex flex-col">
                <div className="text-3xl font-bold text-white mb-2">
                  {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {fiatRates[toCurrency].unit}
                </div>
                <div className="text-sm text-slate-400">
                  {amount} {cryptoRates[fromCurrency].unit} = {convertedAmount.toLocaleString(undefined, { maximumFractionDigits: 8 })} {fiatRates[toCurrency].unit}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Rate:</span>
                    <span>{(fiatRates[toCurrency].value / cryptoRates[fromCurrency].value).toLocaleString(undefined, { maximumFractionDigits: 8 })} {fiatRates[toCurrency].unit}/{cryptoRates[fromCurrency].unit}</span>
                  </div>
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>Updated:</span>
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">Please enter an amount to convert</p>
            )}
            
            <div className="mt-8 text-center text-xs text-slate-500">
              Data provided by CoinGecko API
            </div>
          </div>
        </div>
      </div>
    </div>
  ) 
};

const CurrencyConverter: React.FC = () => {
  return <ExchangeRates />;
};

export default CurrencyConverter;