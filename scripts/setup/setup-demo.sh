#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

PROJECT_ROOT=$(pwd)

echo -e "${YELLOW}Setting up AIVue Demo with all packages...${NC}"

# Array of packages in build order (ensure dependencies are built first)
PACKAGES=("core" "chatbot" "autosuggest" "smartform")

# Clean any previous npm links
echo -e "${YELLOW}Cleaning previous npm links...${NC}"
npm unlink "@aivue/core" "@aivue/chatbot" "@aivue/autosuggest" "@aivue/smartform" 2>/dev/null || true

# Build each package
for package in "${PACKAGES[@]}"; do
  echo -e "${GREEN}Building @aivue/${package}...${NC}"
  
  # Check if package directory exists
  if [ ! -d "${PROJECT_ROOT}/packages/${package}" ]; then
    echo -e "${RED}Package directory packages/${package} not found, skipping...${NC}"
    continue
  fi
  
  cd "${PROJECT_ROOT}/packages/${package}"
  
  # Install dependencies if needed
  echo -e "${YELLOW}Installing dependencies for @aivue/${package}...${NC}"
  npm install
  
  # Clean any previous build
  echo -e "${YELLOW}Cleaning previous build for @aivue/${package}...${NC}"
  npm run clean || rm -rf dist
  
  # Build the package
  echo -e "${YELLOW}Building @aivue/${package}...${NC}"
  npm run build
  
  # Verify all necessary files were created
  if [ ! -d "dist" ]; then
    echo -e "${RED}Build for @aivue/${package} failed! Dist directory not found.${NC}"
    exit 1
  fi
  
  # For core package, verify that the specific expected files exist
  if [ "$package" == "core" ]; then
    if [ ! -f "dist/index.js" ] || [ ! -f "dist/index.mjs" ] || [ ! -f "dist/index.d.ts" ]; then
      echo -e "${RED}The core package build is incomplete. Missing expected output files.${NC}"
      ls -la dist
      exit 1
    fi
  fi
  
  # Create a link to make it available to other packages
  echo -e "${YELLOW}Creating npm link for @aivue/${package}...${NC}"
  npm link
  
  # Return to project root
  cd "${PROJECT_ROOT}"
done

# Install demo dependencies and link packages
echo -e "${GREEN}Setting up the demo project...${NC}"

# Check if demo directory exists
if [ ! -d "${PROJECT_ROOT}/demo" ]; then
  echo -e "${RED}Demo directory not found at ${PROJECT_ROOT}/demo${NC}"
  exit 1
fi

cd "${PROJECT_ROOT}/demo"

# Install dependencies
echo -e "${YELLOW}Installing demo dependencies...${NC}"
npm install

# Clean node_modules/.vite to avoid caching issues
echo -e "${YELLOW}Cleaning Vite cache...${NC}"
rm -rf node_modules/.vite

# Link all the AIVue packages
for package in "${PACKAGES[@]}"; do
  # Only link packages that were successfully built
  if [ -d "${PROJECT_ROOT}/packages/${package}/dist" ]; then
    echo -e "${YELLOW}Linking @aivue/${package} to demo...${NC}"
    npm link "@aivue/${package}"
    
    # Double check that the link worked by checking node_modules
    if [ ! -d "node_modules/@aivue/${package}" ]; then
      echo -e "${RED}Linking @aivue/${package} failed! Package not found in node_modules.${NC}"
      exit 1
    fi
  else
    echo -e "${RED}Skipping @aivue/${package} as it does not have a dist folder${NC}"
  fi
done

echo -e "${GREEN}Setup complete! Starting the demo application...${NC}"
npm run dev

cd "${PROJECT_ROOT}"
echo -e "${GREEN}Done! The demo should now be running at http://localhost:5173${NC}"