import Navbar from "./navbar";

export default function StockMarketData() {
    return (
      <div className="container mx-auto p-4">
      <Navbar />
        <div className="container mx-auto p-4 justify-center items-center">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Stock Market Data
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Stay informed with the latest stock market data and trends. Our comprehensive
            dashboard provides real-time updates, historical data, and insightful
            analyses to help you make well-informed investment decisions. Explore stock
            prices, track performance over time, and gain valuable insights into market
            movements.
          </p>
        </div>
      </div>
    );
  }
  