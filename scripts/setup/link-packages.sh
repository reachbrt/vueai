#!/bin/bash

# Script to link packages for development

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Linking packages for development...${NC}"

# Array of packages
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Build packages
echo -e "${YELLOW}Building packages...${NC}"
npm run build:packages

# Link packages
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Linking @aivue/${package}...${NC}"
  cd "packages/${package}"
  
  # Create dist directory if it doesn't exist
  mkdir -p dist
  
  # Build the package
  npm run build
  
  # Create a symlink
  cd ../..
done

# Install dependencies in the demo
echo -e "${YELLOW}Installing dependencies in the demo...${NC}"
cd demo
npm install

echo -e "${GREEN}All packages have been linked!${NC}"
echo -e "${YELLOW}You can now run the demo with:${NC}"
echo -e "cd demo && npm run dev"
