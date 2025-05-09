#!/bin/bash

# Script to build packages and link them to the demo

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Building and linking packages to the demo...${NC}"

# Array of packages
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Build each package and create symlink
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Processing @aivue/${package}...${NC}"
  cd "packages/${package}"
  
  # Build the package
  echo -e "${YELLOW}Building @aivue/${package}...${NC}"
  npm run build || echo -e "${RED}No build script found for @aivue/${package}, continuing...${NC}"
  
  # Link to demo
  echo -e "${YELLOW}Linking @aivue/${package} to demo...${NC}"
  cd ../../demo
  mkdir -p "node_modules/@aivue"
  
  # Remove previous symlink if it exists
  if [ -L "node_modules/@aivue/${package}" ] || [ -d "node_modules/@aivue/${package}" ]; then
    rm -rf "node_modules/@aivue/${package}"
  fi
  
  # Create symlink
  ln -s "../../../packages/${package}" "node_modules/@aivue/${package}"
  
  # Return to root
  cd ..
done

echo -e "${GREEN}Packages built and linked. Starting demo...${NC}"
cd demo
npm run dev