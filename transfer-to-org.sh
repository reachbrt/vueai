#!/bin/bash

# Script to transfer @aivue/predictive-input to aivue organization

echo "================================================"
echo "📦 Transfer @aivue/predictive-input to aivue org"
echo "================================================"
echo ""

PACKAGE_NAME="@aivue/predictive-input"
ORG_NAME="aivue"

# Check current ownership
echo "🔍 Checking current package ownership..."
echo ""
npm owner ls $PACKAGE_NAME

echo ""
echo "================================================"
echo "📋 Transfer Options"
echo "================================================"
echo ""
echo "Choose a transfer method:"
echo ""
echo "1. 🌐 Web Interface (Recommended)"
echo "   - Safest and easiest method"
echo "   - Opens npm package settings in browser"
echo ""
echo "2. 💻 Command Line"
echo "   - Add organization as owner"
echo "   - Grant organization access"
echo ""
echo "3. ℹ️  Show Instructions Only"
echo "   - Display manual transfer steps"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "================================================"
    echo "🌐 Opening npm Package Settings..."
    echo "================================================"
    echo ""
    echo "Steps to transfer:"
    echo "1. Click on 'Settings' tab"
    echo "2. Scroll to 'Transfer Package Ownership'"
    echo "3. Enter organization name: aivue"
    echo "4. Click 'Transfer Package'"
    echo "5. Confirm the transfer"
    echo ""
    echo "Opening browser..."
    sleep 2
    
    # Open package settings in browser
    if [[ "$OSTYPE" == "darwin"* ]]; then
      open "https://www.npmjs.com/package/@aivue/predictive-input"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
      xdg-open "https://www.npmjs.com/package/@aivue/predictive-input"
    else
      echo "Please open: https://www.npmjs.com/package/@aivue/predictive-input"
    fi
    
    echo ""
    read -p "Press Enter after completing the transfer..."
    
    echo ""
    echo "🔍 Verifying transfer..."
    npm owner ls $PACKAGE_NAME
    
    echo ""
    echo "✅ If 'aivue' appears in the owner list, transfer was successful!"
    echo ""
    echo "📦 Verify at: https://www.npmjs.com/settings/aivue/packages"
    ;;
    
  2)
    echo ""
    echo "================================================"
    echo "💻 Command Line Transfer"
    echo "================================================"
    echo ""
    
    echo "Step 1: Adding organization as owner..."
    npm owner add $ORG_NAME $PACKAGE_NAME
    
    if [ $? -eq 0 ]; then
      echo "✅ Organization added as owner"
    else
      echo "❌ Failed to add organization as owner"
      echo "You may need to use the web interface instead."
      exit 1
    fi
    
    echo ""
    echo "Step 2: Granting organization access..."
    npm access grant read-write ${ORG_NAME}:developers $PACKAGE_NAME
    
    if [ $? -eq 0 ]; then
      echo "✅ Organization access granted"
    else
      echo "⚠️  Warning: Failed to grant access (this may be normal)"
    fi
    
    echo ""
    echo "Step 3: Verifying ownership..."
    npm owner ls $PACKAGE_NAME
    
    echo ""
    echo "================================================"
    echo "✅ Transfer Complete!"
    echo "================================================"
    echo ""
    echo "📦 Verify at: https://www.npmjs.com/settings/aivue/packages"
    ;;
    
  3)
    echo ""
    echo "================================================"
    echo "📋 Manual Transfer Instructions"
    echo "================================================"
    echo ""
    echo "Method 1: Web Interface (Recommended)"
    echo "--------------------------------------"
    echo "1. Go to: https://www.npmjs.com/package/@aivue/predictive-input"
    echo "2. Click 'Settings' tab"
    echo "3. Scroll to 'Transfer Package Ownership'"
    echo "4. Enter: aivue"
    echo "5. Click 'Transfer Package'"
    echo "6. Confirm"
    echo ""
    echo "Method 2: Command Line"
    echo "----------------------"
    echo "npm owner add aivue @aivue/predictive-input"
    echo "npm access grant read-write aivue:developers @aivue/predictive-input"
    echo ""
    echo "Verify Transfer"
    echo "---------------"
    echo "npm owner ls @aivue/predictive-input"
    echo ""
    echo "Check Organization Packages"
    echo "---------------------------"
    echo "https://www.npmjs.com/settings/aivue/packages"
    ;;
    
  *)
    echo ""
    echo "❌ Invalid choice. Please run the script again."
    exit 1
    ;;
esac

echo ""
echo "================================================"
echo "📝 Next Steps"
echo "================================================"
echo ""
echo "1. ✅ Verify package appears at:"
echo "   https://www.npmjs.com/settings/aivue/packages"
echo ""
echo "2. ✅ Check it's listed alongside:"
echo "   - @aivue/chatbot"
echo "   - @aivue/autosuggest"
echo "   - @aivue/core"
echo "   - etc."
echo ""
echo "3. ✅ Test installation still works:"
echo "   npm install @aivue/predictive-input"
echo ""
echo "================================================"
echo "🎉 Transfer Process Complete!"
echo "================================================"

