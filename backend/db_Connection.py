from sqlalchemy import create_engine, text
import os

db_params = {
    'dbname': 'finance',
    'user': 'postgres',
    'password': '12345',
    'host': 'localhost',
    'port': '5432'
}

conn_str = f"postgresql+psycopg2://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"
database_url = os.getenv('DATABASE_URL')

def try_connect(url):
    try:
        engine = create_engine(url)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
            print(f"Database connection successful with {url}!")
        return engine
    except Exception as e:
        print(f"Database connection failed with {url}: {e}")
        return None

if __name__ == '__main__':
    engine = try_connect(database_url) or try_connect(conn_str)
