#!/bin/bash

# Netlify Deployment Script for @aivue packages
# This script automates the successful deployment process we used

set -e

echo "🚀 Starting Netlify Deployment for @aivue Demo..."

# Configuration
SITE_ID="9f08866c-e889-408a-959e-32d8e3f3ab49"
DEMO_DIR="demo"
BUILD_DIR="dist"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ] || [ ! -d "$DEMO_DIR" ]; then
    print_error "Please run this script from the root of the vueai project"
    exit 1
fi

# Step 1: Build all packages
print_status "Building all @aivue packages..."
npm run build:packages || {
    print_error "Failed to build packages"
    exit 1
}
print_success "All packages built successfully"

# Step 2: Install demo dependencies
print_status "Installing demo dependencies..."
cd $DEMO_DIR
npm install || {
    print_error "Failed to install demo dependencies"
    exit 1
}
print_success "Demo dependencies installed"

# Step 3: Build demo
print_status "Building demo application..."
npm run build || {
    print_error "Failed to build demo"
    exit 1
}
print_success "Demo built successfully"

# Step 4: Check if Netlify CLI is available
if ! command -v netlify &> /dev/null; then
    print_warning "Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Step 5: Deploy to Netlify
print_status "Deploying to Netlify..."
npx netlify-cli deploy --prod --dir=$BUILD_DIR --site=$SITE_ID || {
    print_error "Netlify deployment failed"
    exit 1
}

print_success "🎉 Deployment completed successfully!"
print_status "Demo is live at: https://aivue.netlify.app"

# Step 6: Create deployment summary
cd ..
echo "📊 Deployment Summary:" > deployment-summary.md
echo "======================" >> deployment-summary.md
echo "" >> deployment-summary.md
echo "**Deployment Date:** $(date)" >> deployment-summary.md
echo "**Site ID:** $SITE_ID" >> deployment-summary.md
echo "**Demo URL:** https://aivue.netlify.app" >> deployment-summary.md
echo "**Build Directory:** $DEMO_DIR/$BUILD_DIR" >> deployment-summary.md
echo "" >> deployment-summary.md
echo "**Packages Included:**" >> deployment-summary.md
echo "- @aivue/core" >> deployment-summary.md
echo "- @aivue/chatbot" >> deployment-summary.md
echo "- @aivue/autosuggest" >> deployment-summary.md
echo "- @aivue/smartform" >> deployment-summary.md
echo "- @aivue/analytics" >> deployment-summary.md
echo "" >> deployment-summary.md
echo "**Features Deployed:**" >> deployment-summary.md
echo "- Interactive chatbot demo" >> deployment-summary.md
echo "- AI-powered autosuggest" >> deployment-summary.md
echo "- Smart form validation" >> deployment-summary.md
echo "- Real-time analytics dashboard" >> deployment-summary.md
echo "- TypeScript examples" >> deployment-summary.md
echo "- Ollama integration" >> deployment-summary.md

print_success "Deployment summary saved to deployment-summary.md"
