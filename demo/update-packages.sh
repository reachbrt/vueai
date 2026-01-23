#!/bin/bash

# Script to update all @aivue packages to their latest versions from npm
# This ensures the demo always uses the latest published versions

echo "🔄 Updating @aivue packages to latest versions from npm..."
echo ""

# List of @aivue packages to update
packages=(
  "@aivue/360-spin"
  "@aivue/analytics"
  "@aivue/autosuggest"
  "@aivue/browser-llm"
  "@aivue/chatbot"
  "@aivue/core"
  "@aivue/doc-intelligence"
  "@aivue/emotion-ui"
  "@aivue/image-caption"
  "@aivue/predictive-input"
  "@aivue/smart-datatable"
  "@aivue/smartform"
  "@aivue/tabular-intelligence"
)

# Update each package
for package in "${packages[@]}"; do
  echo "📦 Updating $package..."
  npm install "$package@latest"
done

echo ""
echo "✅ All @aivue packages updated to latest versions!"
echo ""
echo "📋 Current versions:"
npm list --depth=0 | grep @aivue

