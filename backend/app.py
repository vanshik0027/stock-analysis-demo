from prometheus_client import Gauge, generate_latest, CollectorRegistry
from flask import Flask, jsonify, request, Response
from sqlalchemy import create_engine, text, inspect
from sqlalchemy.exc import SQLAlchemyError
import yfinance as yf
from apscheduler.schedulers.background import BackgroundScheduler
import threading
import atexit
from datetime import datetime, timedelta
import email.utils
import time
import psutil
from flask_cors import CORS
import os
from data_Ingestion import data as d, companies_Name as uc, historical as hp
import db_Connection as db

app = Flask(__name__)

database_url = os.getenv('DATABASE_URL')
engine = create_engine(database_url)
# engine = create_engine(db.conn_str)
# engine = create_engine(db.conn_str)
registry = CollectorRegistry()
price_change_gauge = Gauge('stock_price_change', 'Stock price percentage change', ['company_name', 'symbol'], registry=registry)
cpu_usage_gauge = Gauge('server_cpu_usage', 'CPU usage percentage', registry=registry)
memory_usage_gauge = Gauge('server_memory_usage', 'Memory usage percentage', registry=registry)

CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/api/stocks', methods=['GET'])
def get_all_stock_names():
    try:
        query = text('SELECT * FROM public."companiesNames"')
        with engine.connect() as connection:
            result = connection.execute(query).fetchall()
            # print(result)
        
        # Extract stock symbols and closing prices from the result
        stocks = [{'symbol': row[0], 'close': row[1]} for row in result]
        
        if stocks:
            return jsonify({'stocks': stocks})
        else:
            return jsonify({'error': 'No stocks found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/stocks/changes/<string:ticker>', methods=['GET'])
def get_closing_price(ticker):
    try:
        print(f"Received ticker: {ticker}")

        # Use the ticker parameter in the query
        query = text("""
            SELECT * FROM stock_data
            WHERE symbol = :ticker OR company_name = :ticker
        """)
        
        # Execute the query with the parameter
        with engine.connect() as connection:
            result = connection.execute(query, {'ticker': ticker}).fetchone()
            # print(f"Result: {result}")

            # Fetch column names
            inspector = inspect(engine)
            columns = [col['name'] for col in inspector.get_columns('stock_data')]
            # print(f"Columns: {columns}")

            if result:
                # Convert result tuple to dictionary using column names
                result_dict = dict(zip(columns, result))
                # print(f"Result Dict: {result_dict}")

                # Add today's date and one month back date to the result dictionary
                today_date = datetime.now()
                one_month_back_date = today_date - timedelta(days=30)  # Approximate one month back

                result_dict['Today_date'] = email.utils.formatdate(today_date.timestamp(), localtime=False, usegmt=True)
                result_dict['One_month_back_date'] = email.utils.formatdate(one_month_back_date.timestamp(), localtime=False, usegmt=True)
                return jsonify(result_dict)
            else:
                return jsonify({'error': 'Ticker not found'}), 404
    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
@app.route('/api/stocks/historical/<string:ticker>', methods=['GET'])
def get_historical(ticker):
    try:
        print(f"Received ticker: {ticker}")

        # Sanitize ticker to prevent SQL injection
        if not ticker.isalnum() or len(ticker) > 10:
            return jsonify({'error': 'Invalid ticker symbol'}), 400

        # Construct the query string with the table name
        table_name = ticker.upper()
        query = text(f"""
            SELECT "Date", "Open", "High", "Low", "Close", "Volume", "Dividends", "Stock Splits"
            FROM public."{table_name}"
        """)

        # Execute the query
        with engine.connect() as connection:
            result = connection.execute(query)
            rows = result.fetchall()
            column_names = result.keys()
            # print(f"Result: {rows}")

            if rows:
                # Convert result tuples to a list of dictionaries
                result_dicts = [dict(zip(column_names, row)) for row in rows]
                # print(f"Result Dicts: {result_dicts}")

                return jsonify(result_dicts)
            else:
                return jsonify({'error': 'Ticker not found'}), 404
    except SQLAlchemyError as e:
        print(f"SQLAlchemy Exception: {str(e)}")
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500

        
    
@app.route('/api/stocks/current/<string:ticker>', methods=['GET'])
def get_current_stock_price(ticker):
    try:
        print(f"Received ticker: {ticker}")

        # Sanitize ticker to prevent invalid symbols
        if not ticker.isalnum() or len(ticker) > 10:
            return jsonify({'error': 'Invalid ticker symbol'}), 400

        # Fetch the stock data using yfinance
        stock = yf.Ticker(ticker)
        stock_info = stock.info

        # List of possible keys to get the stock prices
        price_keys = [
            'previousClose',
            'open',
            'currentPrice',
            'regularMarketPrice'
        ]

        # Dictionary to store the prices
        stock_prices = {}

        # Try to find valid prices in the stock_info
        for key in price_keys:
            if key in stock_info and stock_info[key] is not None:
                stock_prices[key] = stock_info[key]
            else:
                stock_prices[key] = 'Not available'

        # Return the prices as a JSON response
        return jsonify({'ticker': ticker, 'prices': stock_prices})

    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500

    
def update_metrics():
    companies = []
    with engine.connect() as connection:
        query = text("""
            SELECT company_name, symbol, "today_Change(%)"
            FROM stock_data
        """)
        result = connection.execute(query)
        for row in result:
            company_name = row[0]
            symbol = row[1]
            today_change = row[2]
            if abs(today_change) >= 2:
                price_change_gauge.labels(company_name=company_name, symbol=symbol).set(today_change)
                companies.append({'company_name': company_name, 'symbol': symbol, 'today_change': today_change})

    return companies

@app.route('/api/stocks/top-gainers-losers', methods=['GET'])
def get_top_gainers_losers():
    try:
        # Define the query to get top 3 gainers
        top_gainers_query = text("""
            SELECT symbol, company_name, "today_Change(%)", open
            FROM public."stock_data"
            ORDER BY "today_Change(%)" DESC
            LIMIT 3
        """)

        # Define the query to get bottom 3 losers
        bottom_losers_query = text("""
            SELECT symbol, company_name, "today_Change(%)", open
            FROM public."stock_data"
            ORDER BY "today_Change(%)" ASC
            LIMIT 3
        """)

        with engine.connect() as connection:
            # Execute the query to get top 3 gainers
            top_gainers_result = connection.execute(top_gainers_query).fetchall()
            top_gainers_list = [row_to_dict(row) for row in top_gainers_result]

            # Execute the query to get bottom 3 losers
            bottom_losers_result = connection.execute(bottom_losers_query).fetchall()
            bottom_losers_list = [row_to_dict(row) for row in bottom_losers_result]

            return jsonify({
                'top_gainers': top_gainers_list,
                'bottom_losers': bottom_losers_list
            })
    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500

def row_to_dict(row):
    """Converts a database row (tuple) to a dictionary."""
    return dict(zip(('symbol', 'company_name', 'today_Change(%)', 'open'), row))


# @app.route('/api/stocks/update_metrics', methods=['GET'])
# def update_metrics_route():
#     try:
#         companies = update_metrics()
#         return jsonify({"message": "Metrics updated successfully", "companies": companies})
#     except Exception as e:
#         print(f"Exception: {str(e)}")
#         return jsonify({'error': str(e)}), 500

@app.route('/metrics')
def metrics():
    return Response(generate_latest(registry), mimetype='text/plain')

def update_server_metrics():
    while True:
        update_metrics()
        cpu_usage_gauge.set(psutil.cpu_percent())
        memory_usage_gauge.set(psutil.virtual_memory().percent)
        time.sleep(10)  # Update every 10 seconds 
        
def task_every_8_hours():
    # Your task logic for 8-hour interval
    uc.updateCompnaines()
    hp.updateHistoricalData()
    print(f"8-hour task executed at {datetime.now()}")

def task_every_2_minutes():
    # Your task logic for 2-minute interval
    d.updateDataFunc()
    print(f"5-minute task executed at {datetime.now()}")

# Initialize APScheduler
scheduler = BackgroundScheduler()

# Schedule the 8-hour task to run immediately and then every 8 hours
scheduler.add_job(task_every_8_hours, 'date', run_date=datetime.now())
scheduler.add_job(task_every_8_hours, 'interval', hours=8)

# Schedule the 2-minute task to run every 2 minutes
scheduler.add_job(task_every_2_minutes, 'interval', minutes=5)
        
        
if __name__ == '__main__':
    # start_background_task()  
    atexit.register(lambda: scheduler.shutdown())
    threading.Thread(target=update_server_metrics, daemon=True).start()
    
    app.run(debug=True, host='0.0.0.0', port=5000)
