interface CurrencySelectorProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currency, onCurrencyChange }) => {
  return (
    <select
      className="bg-black text-white border border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 hover:bg-gray-800 transition-colors"
      value={currency}
      onChange={(e) => onCurrencyChange(e.target.value)}
    >
      <option value="usd" className="bg-black text-white">USD</option>
      <option value="inr" className="bg-black text-white">INR</option>
    </select>
  );
};

export default CurrencySelector;