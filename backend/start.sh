#!/bin/bash

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Start Flask backend in background
echo "Starting Flask backend..."
cd Flask-Server
python server.py &
cd ..

# Start React frontend
echo "Starting React frontend..."
npm start
