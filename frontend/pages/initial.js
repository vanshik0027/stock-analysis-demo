import Navbar from "./navbar";

export default function StockMarketData() {
  return (
<div className="min-h-screen flex flex-col">
  <Navbar />
  <div className="container mx-auto p-4 text-center flex-grow">
    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-gray-200 mb-4">
      Stock Market Data Analysis
    </h1>
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
      Stay informed with the latest stock market data and trends. Our comprehensive
      dashboard provides real-time updates, historical data, and insightful
      analyses to help you make well-informed investment decisions. Explore stock
      prices, track performance over time, and gain valuable insights into market
      movements.
    </p>

    <div className="flex-grow flex items-center justify-center">
      <div className="flex flex-wrap justify-center gap-10">
        <div className="max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mx-4 my-4">
          <div className="px-8 py-6">
            <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-200">Feature 1</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Detailed stock market data.
            </p>
          </div>
        </div>
        <div className="max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mx-4 my-4">
          <div className="px-8 py-6">
            <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-200">Feature 2</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Historical data for in-depth analysis.
            </p>
          </div>
        </div>
        <div className="max-w-xs w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden mx-4 my-4">
          <div className="px-8 py-6">
            <h3 className="font-bold text-xl mb-2 text-gray-800 dark:text-gray-200">Feature 3</h3>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Insightful market analysis and trends.
            </p>
          </div>
        </div>
      </div>
    </div>

    <footer className="bg-gray-200 dark:bg-gray-800 py-6 mt-8">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Contact Us</h2>
        <p className="text-gray-600 dark:text-gray-400">We would love to hear from you!</p>
        <div className="mt-4">
          <p className="text-gray-600 dark:text-gray-400"><strong>Email:</strong> demo@example.com</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Phone:</strong> (123) 456-7890</p>
          <p className="text-gray-600 dark:text-gray-400"><strong>Address:</strong> 1234 Stock Market Ave, Fin City, FC 56789</p>
        </div>
      </div>
    </footer>
  </div>
</div>

  );
}
