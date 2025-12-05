#!/bin/bash

# Script to publish emotion-ui and doc-intelligence packages to npm

echo "================================================"
echo "📦 Publishing @aivue/emotion-ui and @aivue/doc-intelligence"
echo "================================================"
echo ""

# Check npm login
echo "🔍 Checking npm login..."
npm whoami 2>/dev/null

if [ $? -ne 0 ]; then
  echo "❌ Not logged in. Please login:"
  npm login
  if [ $? -ne 0 ]; then
    echo "❌ Login failed"
    exit 1
  fi
fi

echo "✅ Logged in as: $(npm whoami)"
echo ""

# Publish emotion-ui
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Publishing @aivue/emotion-ui"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd packages/emotion-ui
echo "🔨 Building..."
npm run build

if [ $? -eq 0 ]; then
  echo "📤 Publishing..."
  npm publish
  if [ $? -eq 0 ]; then
    echo "✅ @aivue/emotion-ui published!"
  else
    echo "❌ Failed to publish @aivue/emotion-ui"
  fi
else
  echo "❌ Build failed for @aivue/emotion-ui"
fi

cd ../..
echo ""

# Publish doc-intelligence
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 Publishing @aivue/doc-intelligence"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

cd packages/doc-intelligence
echo "🔨 Building..."
npm run build

if [ $? -eq 0 ]; then
  echo "📤 Publishing..."
  npm publish
  if [ $? -eq 0 ]; then
    echo "✅ @aivue/doc-intelligence published!"
  else
    echo "❌ Failed to publish @aivue/doc-intelligence"
  fi
else
  echo "❌ Build failed for @aivue/doc-intelligence"
fi

cd ../..
echo ""

echo "================================================"
echo "✅ Publication Complete!"
echo "================================================"
echo ""
echo "View packages at:"
echo "https://www.npmjs.com/settings/aivue/packages"
