import { FC } from "react";

interface SpinnerProps {
  loading: boolean;
}


const Spinner: FC<SpinnerProps> = ({ loading }) => (
  
  <div className={`spinner ${loading ? "visible" : "hidden"}`}>
    <span className="loading loading-dots loading-lg"></span>
  </div>

);

export default Spinner;