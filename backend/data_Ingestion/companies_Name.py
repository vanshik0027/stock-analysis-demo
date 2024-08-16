import yfinance as yf
import pandas as pd
from data_Ingestion.database import get_database_engine
import logging

logging.basicConfig(level=logging.DEBUG)

def update_companies():
    symbols = [
        'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'UNH',
        'V', 'MA', 'HD', 'DIS', 'KO', 'PFE', 'NFLX', 'PEP', 'INTC', 'CSCO'
        ]
    
    data = []
    for symbol in symbols:
        stock = yf.Ticker(symbol)
        info = stock.info
        data.append({'symbol': symbol, 'name': info.get('shortName', 'N/A')})

    df = pd.DataFrame(data)
    engine = get_database_engine()
    df.to_sql('companiesNames', engine, if_exists='replace', index=False)
    print("Company names successfully inserted into PostgreSQL database.")

# update_companies()

# import yfinance as yf
# import pandas as pd
# from sqlalchemy import create_engine
# import os

# db_params = {
#     'dbname': 'finance',
#     'user': 'postgres',
#     'password': '12345',
#     'host': '127.0.0.1',
#     'port': '5432'
# }

# database_url = os.getenv('DATABASE_URL')
# # engine = create_engine(database_url)
#     # Create a connection string
# conn_str = f"postgresql+psycopg2://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
# def try_connect(url):
#         try:
#             engine = create_engine(url)
#             with engine.connect() as connection:
#                 print(f"Connection successful with {url}!")
#             return engine
#         except Exception as e:
#             print(f"Connection failed with {url}: {e}")
#             return None

# # Try the primary and backup connection strings
# engine = try_connect(database_url) or try_connect(conn_str)

#     # Create a SQLAlchemy engine
# # engine = create_engine(conn_str)

# def updateCompnaines():
#     # List of company symbols
#     symbols = [
#         'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'UNH',
#         'V', 'MA', 'HD', 'DIS', 'KO', 'PFE', 'NFLX', 'PEP', 'INTC', 'CSCO'
#     ]

#     # Fetch company names and symbols
#     data = []

#     for symbol in symbols:
#         stock = yf.Ticker(symbol)
#         info = stock.info
#         data.append({
#             'symbol': symbol,
#             'name': info.get('shortName', 'N/A')  # Using 'shortName' for company name
#         })

#     # Create DataFrame
#     df = pd.DataFrame(data)

#     # Display DataFrame
#     # print(df)
#     df.to_sql('companiesNames', engine, if_exists='append', index=False)

#     print("Data successfully inserted into PostgreSQL database.")
# # updateCompnaines()