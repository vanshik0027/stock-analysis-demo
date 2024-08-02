from sqlalchemy import create_engine, text


db_params = {
    'dbname': 'finance',
    'user': 'postgres',
    'password': '12345',
    'host': 'localhost',
    'port': '5432'
}  
# Corrected database URL with the correct database name 'finance'
conn_str = f"postgresql+psycopg2://{db_params['user']}:{db_params['password']}@{db_params['host']}:{db_params['port']}/{db_params['dbname']}"

def test_connection():
    try:
        engine = create_engine(conn_str)
        with engine.connect() as connection:
            # Wrap the query in the text() function
            result = connection.execute(text("SELECT 1"))
            if result:
                print("Database connection successful!")
    except Exception as e:
        print(f"Database connection failed: {e}")

if __name__ == '__main__':
    test_connection()
