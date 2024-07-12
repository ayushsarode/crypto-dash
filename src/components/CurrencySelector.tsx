interface CurrencySelectorProps {
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ currency, onCurrencyChange }) => {
  return (
    <select
      className="btn btn-outline border-white border-2 hover:bg-white"
      value={currency}
      onChange={(e) => onCurrencyChange(e.target.value)}
    >
      <option value="usd" className="btn ">USD</option>
      <option value="inr" className="btn">INR</option>
    </select>
  );
};

export default CurrencySelector;
