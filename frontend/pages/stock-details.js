import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import axios from 'axios';

// Extend dayjs with plugins
dayjs.extend(advancedFormat);

const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:5000/api/stocks';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Mock function to fetch historical data for a specific stock
const fetchHistoricalData = async (sym) => {
  // Replace with actual data fetching logic
  // const value = symbol
  // const indexdata = value.indexOf("(")
  // const newValue = value.slice(indexdata + 1, value.length - 1)
  // console.log(`${baseUrl}/historical/${symbol}`)
  const response = await axios.get(`${baseUrl}/historical/${sym}`)
  return response.data;
};

// Aggregation functions
const aggregateData = (data, period) => {
  const groupedData = data.reduce((acc, curr) => {
    const date = dayjs(curr.Date);
    let key;

    switch (period) {
      case 'month':
        key = date.format('YYYY-MM');
        break;
      case 'year':
        key = date.format('YYYY');
        break;
      default:
        key = date.format('YYYY-MM-DD');
    }

    if (!acc[key]) {
      acc[key] = { Open: [], High: [], Close: [] };
    }

    acc[key].Open.push(curr.Open);
    acc[key].High.push(curr.High);
    acc[key].Close.push(curr.Close);

    return acc;
  }, {});

  return {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: 'Open Price',
        data: Object.values(groupedData).map(v => Math.min(...v.Open)),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: true,
      },
      {
        label: 'High Price',
        data: Object.values(groupedData).map(v => Math.max(...v.High)),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        fill: true,
      },
      {
        label: 'Close Price',
        data: Object.values(groupedData).map(v => v.Close[v.Close.length - 1]),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        fill: true,
      },
    ]
  };
};

export default function StockDetails() {
  const router = useRouter();
  const { symbol, company } = router.query;
  const [historicalData, setHistoricalData] = useState([]);
  console.log(symbol)
  useEffect(() => {
    if (symbol) {
      const loadHistoricalData = async () => {
        const data = await fetchHistoricalData(symbol);
        setHistoricalData(data);
      };

      loadHistoricalData();
    }
  }, [symbol]);

  const chartOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const openPrice = historicalData[index].Open.toFixed(3);
            const highPrice = historicalData[index].High.toFixed(3);
            const closePrice = historicalData[index].Close.toFixed(3);

            return [
              `Open: ${openPrice}`,
              `High: ${highPrice}`,
              `Close: ${closePrice}`
            ];
          }
        }
      }
    }
  };

  const dailyData = {
    labels: historicalData.map(data => dayjs(data.Date).format('YYYY-MM-DD')),
    datasets: [
      { label: 'Open Price', data: historicalData.map(data => data.Open), borderColor: 'blue', backgroundColor: 'rgba(0, 0, 255, 0.2)', fill: true },
      // { label: 'High Price', data: historicalData.map(data => data.High), borderColor: 'green', backgroundColor: 'rgba(0, 255, 0, 0.2)', fill: true,hidden:true },
      // { label: 'Close Price', data: historicalData.map(data => data.Close), borderColor: 'red', backgroundColor: 'rgba(255, 0, 0, 0.2)', fill: true,hidden:true }
    ]
  };

  const monthlyData = aggregateData(historicalData, 'month');
  const yearlyData = aggregateData(historicalData, 'year');

  return (

    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          Historical Data for {company} - {symbol}
        </h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => router.back()}
        >
          Back
        </button>
      </div>


      {/* <div className="flex flex-wrap justify-between mb-4">
        <div className="w-full sm:w-1/2 p-2">
          <h2 className="text-xl font-semibold mb-1">Daily Data</h2>
          <Line data={dailyData} options={chartOptions} />
        </div>
        <div className="w-full sm:w-1/2 p-2">
          <h2 className="text-xl font-semibold mb-2">Monthly Data</h2>
          <Line data={monthlyData} />
        </div>
      </div>

      <div className="flex justify-center mb-4">
        <div className="w-full md:w-2/3 lg:w-1/2 p-2">
          <h2 className="text-xl font-semibold mb-2">Yearly Data</h2>
          <div className="w-11/12"> // Add this div to decrease the width
            <Line data={yearlyData} />
          </div>
        </div>
      </div> */}
        <div className="w-[800px] p-2 mx-auto">
          <h2 className="text-xl font-semibold mb-1">Yearly Data by Date</h2>
          <Line data={dailyData} options={chartOptions} />
        </div>
        <div className="flex flex-wrap justify-between mb-4">
          <div className="w-full sm:w-1/2 p-2">
            <h2 className="text-xl font-semibold mb-2">Yearly Data by Month</h2>
            <div className="w-11/12">
            <Line data={monthlyData} />
            </div>
          </div>
            <div className="w-full md:w-2/3 lg:w-1/2 p-2">
              <h2 className="text-xl font-semibold mb-2">Yearly Data</h2>
              <div className="w-11/12"> 
                <Line data={yearlyData} />
              </div>
            </div>
            </div>
        </div>
        );
}
