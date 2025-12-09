#!/bin/bash

# Script to publish all @aivue packages to GitHub Package Registry
# This will make them appear in the GitHub Packages sidebar

set -e

echo "🚀 Publishing @aivue packages to GitHub Package Registry..."
echo ""

# Check if GITHUB_TOKEN is set
if [ -z "$GITHUB_TOKEN" ]; then
  echo "❌ Error: GITHUB_TOKEN environment variable is not set"
  echo "Please create a GitHub Personal Access Token with 'write:packages' permission"
  echo "Then run: export GITHUB_TOKEN=your_token_here"
  exit 1
fi

# Configure npm for GitHub Packages
echo "@aivue:registry=https://npm.pkg.github.com" > .npmrc.temp
echo "//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}" >> .npmrc.temp

# Build all packages first
echo "📦 Building all packages..."
npm run build:packages

echo ""
echo "📤 Publishing packages to GitHub Package Registry..."
echo ""

# List of all packages
packages=(
  "core"
  "chatbot"
  "autosuggest"
  "smartform"
  "image-caption"
  "emotion-ui"
  "doc-intelligence"
  "predictive-input"
  "smart-notify"
  "voice-actions"
  "analytics"
  "smart-datatable"
  "360-spin"
  "chatbot-storage"
)

# Publish each package
for pkg in "${packages[@]}"; do
  echo "Publishing @aivue/$pkg..."
  
  cd "packages/$pkg"
  
  # Copy the GitHub npmrc
  cp ../../.npmrc.temp .npmrc
  
  # Publish from dist directory if it exists, otherwise from package root
  if [ -d "dist" ]; then
    cd dist
    cp ../.npmrc .npmrc
  fi
  
  # Publish to GitHub Packages
  npm publish --registry=https://npm.pkg.github.com 2>&1 || echo "⚠️  Failed to publish @aivue/$pkg (may already exist)"
  
  # Go back to root
  cd ../..
  
  echo "✅ @aivue/$pkg published"
  echo ""
done

# Cleanup
rm -f .npmrc.temp
find packages -name ".npmrc" -type f -delete

echo ""
echo "🎉 All packages published to GitHub Package Registry!"
echo "📦 View them at: https://github.com/reachbrt?tab=packages"
echo ""
echo "Note: It may take a few minutes for packages to appear in the sidebar"

