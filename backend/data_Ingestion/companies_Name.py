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

