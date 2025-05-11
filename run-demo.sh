#!/bin/bash

echo "Starting Vue AI Components Demo..."
cd demo
echo "Running demo on port 8080..."
echo "Environment mode: $([ -z "$NODE_ENV" ] && echo "development" || echo "$NODE_ENV")"
echo ".env file exists: $([ -f .env ] && echo "true" || echo "false")"
echo ".env.local file exists: $([ -f .env.local ] && echo "true" || echo "false")"
npm run dev
