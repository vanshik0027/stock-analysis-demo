FROM python:3.9-slim

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libffi-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code
COPY . /app

EXPOSE 5000

ENTRYPOINT ["python"]
CMD ["app.py"]


# FROM python:3.9
# COPY . /app
# WORKDIR /app
# RUN pip install -r requirements.txt 
# EXPOSE 5000 
# ENTRYPOINT [ "python" ] 
# CMD [ "app.py" ] 