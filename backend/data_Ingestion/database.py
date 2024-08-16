from sqlalchemy import create_engine
import os

# Centralized database connection parameters and function
db_params = {
    'dbname': 'finance',
    'user': 'postgres',
    'password': '12345',
    'host': '127.0.0.1',
    'port': '5432'
}

conn_str = f"postgresql+psycopg2://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
database_url = os.getenv('DATABASE_URL')

def get_database_engine():
    """Tries to connect to the database using either the environment URL or fallback connection string."""
    def try_connect(url):
        try:
            engine = create_engine(url)
            with engine.connect() as connection:
                print(f"Connection successful with {url}!")
            return engine
        except Exception as e:
            print(f"Connection failed with {url}: {e}")
            return None

    # Try the primary and backup connection strings
    return try_connect(database_url) or try_connect(conn_str)
