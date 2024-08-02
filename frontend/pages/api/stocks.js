// pages/index.js

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

// Use the Next.js API route as the proxy
const fetchStockData = async (symbols) => {
  try {
    const response = await axios.get("/api/stocks", {
      params: { symbols: symbols.join(",") },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw new Error("Failed to fetch stock data");
  }
};

export default function Home() {
  const [symbols, setSymbols] = useState(["AAPL", "MSFT", "GOOGL"]);

  const { data: stocks, isLoading, error } = useQuery({
    queryKey: ["stocks", symbols],
    queryFn: () => fetchStockData(symbols),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Stock Monitor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stocks.map((stock) => (
          <div key={stock.symbol} className="border p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold">{stock.symbol}</h3>
            <p>Closing Price: ${stock.close.toFixed(2)}</p>
            <p>
              Change: {stock.change.toFixed(2)} ({stock.percent_change.toFixed(2)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
