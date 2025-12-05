#!/bin/bash

# Script to publish @aivue/predictive-input to npm

echo "================================================"
echo "📦 Publishing @aivue/predictive-input to npm"
echo "================================================"
echo ""

# Navigate to package directory
cd packages/predictive-input

echo "✅ Current directory: $(pwd)"
echo "✅ Package: @aivue/predictive-input"
echo "✅ Version: 1.0.1"
echo ""

# Check if already logged in
echo "🔍 Checking npm login status..."
npm whoami 2>/dev/null

if [ $? -ne 0 ]; then
  echo ""
  echo "❌ Not logged in to npm"
  echo ""
  echo "📝 Please login to npm manually:"
  echo "   Username: aivue"
  echo "   Email: reachbrt@gmail.com"
  echo ""
  echo "Running: npm login"
  echo ""
  
  npm login
  
  if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Login failed. Please try again."
    exit 1
  fi
else
  echo "✅ Already logged in as: $(npm whoami)"
fi

echo ""
echo "================================================"
echo "📤 Publishing package..."
echo "================================================"
echo ""

npm publish

if [ $? -eq 0 ]; then
  echo ""
  echo "================================================"
  echo "✅ SUCCESS! Package published to npm"
  echo "================================================"
  echo ""
  echo "📦 Package: @aivue/predictive-input@1.0.1"
  echo "🔗 URL: https://www.npmjs.com/package/@aivue/predictive-input"
  echo ""
  echo "📥 Install with:"
  echo "   npm install @aivue/predictive-input"
  echo ""
else
  echo ""
  echo "================================================"
  echo "❌ FAILED! Package publish failed"
  echo "================================================"
  echo ""
  echo "Please check the error message above."
  exit 1
fi

