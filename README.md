# Stock Market Data Analysis
## Overview
This project analyzes stock market data with a focus on KPIs:

* **Daily Closing Price:** End-of-day stock price.
* **Price Change Percentage:** Change in price over various periods.
* **Top Gainers/Losers:** Stocks with highest gains/losses.

## Key Components
**1. Data Ingestion:** Fetch data from Yahoo Finance using Python, and store it in PostgreSQL.

**2. Data Storage:** Structured schema in PostgreSQL.

**3. Report Generation:** Automated reports using Python and pandas.

**4. Alerting System:*** Prometheus for monitoring, Grafana for visualization.

**5. Frontend:** Responsive UI with Next.js.

**6. Backend:** APIs with Flask.

**7. Containerization:** Docker for isolated environments.

**8. Deployment:** Kubernetes and Helm for scaling.

## Setup Instructions
**1. Clone the Repository:**
```bash
git clone (https://github.com/vanshik0027/stock-analysis-dem0)
cd stock-market-data-analysis
```
**2. Build Docker Images:**
```bash
docker build -t backend-image ./backend
docker build -t frontend-image ./frontend
```

**3. Deploy to Kubernetes:**
run this command for the deployment 
```bash
./deployAPP.ps1
```
**4. Access the Application:**
For access do forwarding of service. I did in minikube nod so, do by port-forward
```bash
kubectl port-forward svc/serviceName 8090:8090
```
**4. Setup Configuration:**
* check when the pods UP
* pass frontend and backend metric pod_IP: port in target of Prometheus  
* and Lastly configure the data source connection in  Grafana

## Troubleshooting
**Connection Issues:** Verify Kubernetes services are correctly exposed.

**Build Issues:** Check the Dockerfile and build logs for errors.

**Deployment Issues:** Review Helm release status and Kubernetes pod logs.
  




