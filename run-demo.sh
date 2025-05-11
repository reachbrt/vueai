#!/bin/bash

# Script to run the demo folder
echo "Starting Vue AI Components Demo..."

# Navigate to the demo directory
cd "$(dirname "$0")/demo" || { echo "Error: Could not navigate to demo directory"; exit 1; }

# Check if the demo directory exists
if [ ! -d "$(pwd)" ]; then
  echo "Error: Demo directory not found"
  exit 1
fi

# Run the demo
echo "Running demo on port 8080..."
npx vite --host localhost --port 8080
