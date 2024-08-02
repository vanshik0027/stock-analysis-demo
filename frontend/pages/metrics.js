// pages/metrics.js

import { useEffect, useState } from 'react';

const MetricsPage = () => {
  const [metrics, setMetrics] = useState('');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/metrics'); // Fetch from the same server
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.text();
        setMetrics(data);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  // Display raw metrics
  return (
    <div>
      <h1>Prometheus Metrics</h1>
      <pre>{metrics}</pre>
    </div>
  );
};

export default MetricsPage;
