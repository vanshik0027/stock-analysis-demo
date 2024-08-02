const express = require('express');
const client = require('prom-client');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const port = process.env.PORT || 8090;

// Create a new Registry for metrics
const register = new client.Registry();

// Define metrics with port number as a label
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code', 'port'],
  registers: [register]
});

// Register the metrics
register.registerMetric(httpRequestDurationMicroseconds);

app.prepare().then(() => {
  const server = express();

  // Middleware to observe requests and include port number in labels
  server.use((req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
      end({ 
        method: req.method, 
        route: req.route?.path || 'unknown', 
        code: res.statusCode,
        port: port
      });
    });
    next();
  });

  // Metrics endpoint
  server.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  // Serve Next.js pages
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Server is running on http://localhost:${port}`);
  });
});
